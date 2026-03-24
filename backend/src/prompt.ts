import type { DietPlanRequest } from "./types";

const objectiveLabels: Record<DietPlanRequest["objetivo"], string> = {
  perda_de_peso: "Perda de peso",
  ganho_de_massa: "Ganho de massa",
  manutencao: "Manutenção",
  melhora_de_performance: "Melhora de performance",
  saude_metabolica: "Saúde metabólica",
};

const dietTypeLabels: Record<DietPlanRequest["tipo_alimentacao"], string> = {
  onivoro: "Onívoro",
  flexitariano: "Flexitariano",
  pescetariano: "Pescetariano",
  vegetariano: "Vegetariano",
  vegano: "Vegano",
};

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
    10. Respeite estritamente o tipo de alimentação informado pelo usuário.
    11. Nunca inclua ingredientes presentes nas restrições alimentares informadas.
    `,
  ].join("\n");
}

export function buildUserPrompt(input: DietPlanRequest) {
  const restricoes =
    input.restricoes_alimentares.length > 0
      ? input.restricoes_alimentares.join(", ")
      : "Nenhuma restrição alimentar informada";

  return [
    "Gere um plano alimentar personalizado com base nos dados:",
    `Nome: ${input.nome}`,
    `Idade: ${input.idade} anos`,
    `Altura em mm: ${input.altura_mm} mm`,
    `Peso em kg: ${input.peso_kg} kg`,
    `Sexo: ${input.sexo}`,
    `Nível de atividade física: ${input.nivel_atividade} dias por semana`,
    `Objetivo: ${objectiveLabels[input.objetivo]}`,
    `Tipo de alimentação: ${dietTypeLabels[input.tipo_alimentacao]}`,
    `Restrições alimentares: ${restricoes}`,
  ].join("\n");
}

export function buildDocsSystemPrompt(doc: string) {
  return `Documento técnico para geracao de dietas: ${doc}`;
}
