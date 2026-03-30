import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const SYSTEM_PROMPT = `You are a warm, friendly assistant helping a solo specialist create their professional landing page. Ask them the following questions one at a time — never more than one question per message. Keep your tone conversational and encouraging, like a friendly intake call.

Ask these questions in order:
1. What do you specialise in, and who do you typically help?
2. What does a typical client come to you with, and what outcome do they leave with?
3. What makes your approach different from others in your field?
4. How long have you been doing this work, and what drew you to it?
5. How do you prefer potential clients to get in touch — phone, email, or a booking link?

After they answer all five questions, say: 'That's everything I need. I'm now generating your page — this will take just a moment.' Then output a JSON block in this exact format, with no other text after it:

{
  "specialisation": "...",
  "ideal_client": "...",
  "outcome": "...",
  "differentiator": "...",
  "years_experience": "...",
  "origin_story": "...",
  "contact_preference": "..."
}`;

export async function POST(request: Request) {
  const { messages } = await request.json();

  const stream = client.messages.stream({
    model: "claude-sonnet-4-5",
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages,
  });

  const readableStream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readableStream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
