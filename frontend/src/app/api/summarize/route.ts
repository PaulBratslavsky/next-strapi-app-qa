import { NextRequest } from "next/server";
import { actions } from "@/data/actions";
import { services } from "@/data/services";

export const maxDuration = 150;
export const dynamic = "force-dynamic";

const TEMPLATE = `
You are an expert content analyst and copywriter. Create a comprehensive summary following this exact structure:

## Quick Overview
Start with a 2-3 sentence description of what this content covers.

## Key Topics Summary
Summarize the content using 5 main topics. Write in a conversational, first-person tone as if explaining to a friend.

## Key Points & Benefits
List the most important points and practical benefits viewers will gain.

## Detailed Summary
Write a complete Summary including:
- Engaging introduction paragraph
- Timestamped sections (if applicable)
- Key takeaways section
- Call-to-action

---
Format your response using clear markdown headers and bullet points. Keep language natural and accessible throughout.
`.trim();

export async function POST(req: NextRequest) {
  const user = await services.auth.getUserMeService();
  const token = await actions.auth.getAuthTokenAction();

  if (!user.success || !token) {
    return new Response(
      JSON.stringify({ data: null, error: "Not authenticated" }),
      { status: 401 }
    );
  }

  console.log("USER CREDITS: ", user.data?.credits)

  if (!user.data || (user.data.credits || 0) < 1) {
    return new Response(
      JSON.stringify({
        error: {
          status: 402,
          name: "InsufficientCredits", 
          message: "Insufficient credits to generate summary",
        }
      }),
      { status: 402 }
    );
  }

  const body = await req.json();
  const { fullTranscript } = body;

  if (!fullTranscript) {
    return new Response(
      JSON.stringify({ error: "No transcript provided" }),
      { status: 400 }
    );
  }

  try {
    const summary = await services.summarize.generateSummary(
      fullTranscript,
      TEMPLATE
    );

    return new Response(JSON.stringify({ data: summary, error: null }));
  } catch (error) {
    console.error("Error processing request:", error);
    if (error instanceof Error)
      return new Response(JSON.stringify({ error: error.message }));
    return new Response(JSON.stringify({ error: "Error generating summary." }));
  }
}
