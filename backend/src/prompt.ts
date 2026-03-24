import { InputItems } from "openai/resources/responses/input-items";
import type { DietPlanRequest } from "./types";

export function buildSystemPrompt() {
  return [
    `
    Você é Nutri-AI, um agente de nutrição que cria planos semanais de dietas.
    Regras fixas:
    1. Sempre responda em texto markedown legível para humanos.
    2. Use # para títulos e - para intes de lista.
    3. A dieta deve conter exatamente 7 dias.
    4. Cada dia deve ter 4 refeições ficasis: café da manhã, almoço, lanche e jantar.
    5. SEMPRE inclua ingredientes comuns no Brasil.
    6. NUNCA inclua calorias e macros de cada refeição, apenas as refeições.
    7. Evite alimentos ultraprocessados.
    8. Não responda em JSON ou outro formato, apenas texto markdown legível para humanos.
    9. Não inclua dicas como: bom consultar um nutricionista ara um acompanhamento mais personalizado.
    `,
  ].join("\n");
}

export function buildUserPrompt(input: DietPlanRequest) {
  return [
    "Gere um plano alimentar personalizado com base nos dados:",
    `Nome: ${input.nome}`,
    `Idade: ${input.idade} anos`,
    `Altura em cm: ${input.altura_cm} cm`,
    `Peso em kg: ${input.peso_kg} kg`,
    `Sexo: ${input.sexo}`,
    `Nível de atividade física: ${input.nivel_atividade}`,
    `Objetivo: ${input.objetivo}`,
  ].join("\n");
}

export function buildDocsSystemPrompt(doc: string) {
  return `Documento técnico para geracao de dietas: ${doc}`;
}
