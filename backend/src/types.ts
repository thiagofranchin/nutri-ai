import { z } from "zod";

const DietObjectiveSchema = z.enum([
  "perda_de_peso",
  "ganho_de_massa",
  "manutencao",
  "melhora_de_performance",
  "saude_metabolica",
]);

const LegacyDietObjectiveSchema = z.enum([
  "perda_de_peso",
  "hipertrofia",
  "manter_massa_muscular",
]);

const DietTypeSchema = z.enum([
  "onivoro",
  "flexitariano",
  "pescetariano",
  "vegetariano",
  "vegano",
]);

const LegacyActivityLevelSchema = z.enum([
  "sedentario",
  "2x_semana",
  "4x_semana",
]);

function sanitizeRestrictions(values: string[]) {
  const unique = new Map<string, string>();

  values
    .map((value) => value.trim().replace(/\s+/g, " "))
    .filter(Boolean)
    .forEach((value) => {
      const normalized = value.toLocaleLowerCase("pt-BR");
      if (!unique.has(normalized)) {
        unique.set(normalized, value);
      }
    });

  return Array.from(unique.values());
}

export const DietPlanRequestSchema = z.object({
  nome: z.string().min(2),
  idade: z.number().int().positive(),
  altura_mm: z.number().int().positive(),
  peso_kg: z.number().positive(),
  sexo: z.enum(["masculino", "feminino"]),
  nivel_atividade: z
    .union([z.number().int().min(1).max(7), LegacyActivityLevelSchema])
    .transform((value) => {
      if (typeof value === "number") {
        return value;
      }

      if (value === "sedentario") {
        return 1;
      }

      if (value === "2x_semana") {
        return 2;
      }

      return 4;
    }),
  objetivo: z
    .union([DietObjectiveSchema, LegacyDietObjectiveSchema])
    .transform((value): z.infer<typeof DietObjectiveSchema> => {
      if (value === "hipertrofia") {
        return "ganho_de_massa";
      }

      if (value === "manter_massa_muscular") {
        return "manutencao";
      }

      return value;
    }),
  tipo_alimentacao: DietTypeSchema.default("onivoro"),
  restricoes_alimentares: z
    .array(z.string())
    .default([])
    .transform(sanitizeRestrictions),
});

export type DietPlanRequest = z.infer<typeof DietPlanRequestSchema>;
