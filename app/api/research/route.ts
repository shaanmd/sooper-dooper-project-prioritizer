import Anthropic from "@anthropic-ai/sdk";
import { supabase } from "@/lib/supabase";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const researchPrompt = (project: Record<string, unknown>) => `You are a business analyst researching project viability.
PROJECT DETAILS:
Name: ${project.name}
Description: ${project.description}
User's learning goals: ${(project.learning_goals as string[]).join(", ")}
User's constraints: ${project.constraints || "None"}

RESEARCH TASKS:
1. Assess market demand for this type of product (score 1-10, where 10 = massive pain point)
2. Find 2-3 existing competitors (name, URL, approximate pricing)
3. Identify unique selling point (what makes this different from competitors)
4. Estimate revenue potential:
   - What price range do competitors charge?
   - Approximate market size
   - Suggest pricing for this project ($X-$Y range)
5. Estimate build costs:
   - Initial development cost (tools, services, one-time expenses)
   - Monthly running costs (hosting, SaaS subscriptions, APIs)
6. Estimate time to build (in weeks, for a skilled developer)
7. Assess audience:
   - Size score (1-10, where 10 = huge potential audience)
   - Accessibility score (1-10, where 10 = very easy to reach this audience)
8. List required skills/tools (e.g., React, AI API, Stripe)
9. Document all assumptions you made

Return ONLY valid JSON with this structure:
{
  "demand_score": 8,
  "competitors": [
    {"name": "CompetitorA", "url": "https://...", "pricing": "$29/mo"},
    {"name": "CompetitorB", "url": "https://...", "pricing": "$49/mo"}
  ],
  "unique_selling_point": "...",
  "revenue_min": 1000,
  "revenue_max": 5000,
  "suggested_pricing": 39,
  "build_cost_initial": 500,
  "build_cost_monthly": 50,
  "time_to_build_weeks": 8,
  "audience_size_score": 7,
  "accessibility_score": 6,
  "skills_required": ["React", "AI API", "Stripe"],
  "assumptions": "Assumed US market, SaaS pricing model, solo developer"
}`;

export async function POST(request: Request) {
  let body: { projectId?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { projectId } = body;
  if (!projectId) {
    return Response.json({ error: "projectId is required" }, { status: 400 });
  }

  // Fetch project from Supabase
  const { data: project, error: fetchError } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .single();

  if (fetchError || !project) {
    return Response.json({ error: "Project not found" }, { status: 404 });
  }

  // Call Claude
  let rawText: string;
  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      messages: [{ role: "user", content: researchPrompt(project) }],
    });
    rawText = (message.content[0] as { type: string; text: string }).text;
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: `Claude API error: ${msg}` }, { status: 502 });
  }

  let parsed: Record<string, unknown>;
  try {
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    parsed = JSON.parse(jsonMatch ? jsonMatch[0] : rawText);
  } catch {
    return Response.json({ error: "Failed to parse Claude response", raw: rawText }, { status: 500 });
  }

  // Insert into ai_research table
  const { error: insertError } = await supabase
    .from("ai_research")
    .insert([{ project_id: projectId, ...parsed }]);

  if (insertError) {
    return Response.json({ error: insertError.message }, { status: 500 });
  }

  return Response.json(parsed, { status: 200 });
}
