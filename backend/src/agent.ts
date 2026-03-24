import OpenAI from "openai";
import {
  buildDocsSystemPrompt,
  buildSystemPrompt,
  buildUserPrompt,
} from "./prompt";
import type { DietPlanRequest } from "./types";
import fs from "fs";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY as string,
  timeout: 2 * 60 * 1000, // 2 minutos
  logLevel: "debug",
});

export async function* generateDietPlan(input: DietPlanRequest) {
  const diretrizes = fs.readFileSync("knowledge/diretrizes.md", "utf-8");

  const data = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: buildSystemPrompt(),
      },
      {
        role: "system",
        content: buildDocsSystemPrompt(diretrizes),
      },
      {
        role: "user",
        content: buildUserPrompt(input),
      },
    ],
    temperature: 0.6, // Quanto maior a temperatura, mais criativa e variada será a resposta. Valores mais baixos tendem a gerar respostas mais conservadoras e repetitivas.
    stream: true, // Se true, a resposta será enviada em partes (chunks) à medida que for gerada. Se false, a resposta completa será enviada de uma vez.
  });

  for await (const chunk of data) {
    const delta = chunk.choices[0]?.delta.content;
    if (delta) {
      yield delta;
    }
  }
}
