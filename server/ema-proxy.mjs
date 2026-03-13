import http from "node:http";
import OpenAI from "openai";

const port = Number.parseInt(process.env.PORT || "8787", 10);
const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";
const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  console.error("Missing OPENAI_API_KEY environment variable.");
  process.exit(1);
}

const client = new OpenAI({ apiKey });

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  });
  response.end(JSON.stringify(payload));
}

function buildSystemPrompt(language) {
  return [
    "You are EMA AI 4.0 for the Moon River villa website.",
    "Answer briefly, warmly, and helpfully.",
    "Prefer the user's language. The requested language code is:",
    language || "cs",
    "Use only these project facts unless the user asks for something broader:",
    "- Location: Lojzova Paseka near Frymburk, Sumava area.",
    "- Long-term rental pricing: 37,500 CZK/month with own furnishing, 50,000 CZK/month with owner furnishing.",
    "- Individual furnishing elements can be agreed separately.",
    "- The site showcases the real gallery, hero video, pricing, and contact form.",
    "If you do not know something, say so plainly and suggest contacting the team."
  ].join(" ");
}

function mapMessages(messages) {
  return messages.map((message) => ({
    role: message.role === "assistant" ? "assistant" : "user",
    content: [{ type: "input_text", text: message.text }]
  }));
}

const server = http.createServer(async (request, response) => {
  if (request.method === "OPTIONS") {
    sendJson(response, 200, { ok: true });
    return;
  }

  if (request.method !== "POST" || request.url !== "/api/ema") {
    sendJson(response, 404, { error: "Not found" });
    return;
  }

  let rawBody = "";
  request.on("data", (chunk) => {
    rawBody += chunk;
  });

  request.on("end", async () => {
    try {
      const body = JSON.parse(rawBody || "{}");
      const messages = Array.isArray(body.messages) ? body.messages : [];
      const language = typeof body.language === "string" ? body.language : "cs";

      if (messages.length === 0) {
        sendJson(response, 400, { error: "Missing messages" });
        return;
      }

      const apiResponse = await client.responses.create({
        model,
        input: [
          {
            role: "system",
            content: [{ type: "input_text", text: buildSystemPrompt(language) }]
          },
          ...mapMessages(messages)
        ]
      });

      sendJson(response, 200, {
        reply: apiResponse.output_text || "EMA momentalne nema odpoved."
      });
    } catch (error) {
      sendJson(response, 500, {
        error: "EMA proxy request failed",
        detail: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
});

server.listen(port, () => {
  console.log(`EMA proxy listening on http://localhost:${port}/api/ema`);
});
