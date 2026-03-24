export const dietObjectiveValues = [
  "perda_de_peso",
  "ganho_de_massa",
  "manutencao",
  "melhora_de_performance",
  "saude_metabolica",
] as const;

export const dietTypeValues = [
  "onivoro",
  "flexitariano",
  "pescetariano",
  "vegetariano",
  "vegano",
] as const;

export type DietObjective = (typeof dietObjectiveValues)[number];
export type DietType = (typeof dietTypeValues)[number];

export const dietObjectiveLabels: Record<DietObjective, string> = {
  perda_de_peso: "Perda de peso",
  ganho_de_massa: "Ganho de massa",
  manutencao: "Manutenção",
  melhora_de_performance: "Melhora de performance",
  saude_metabolica: "Saúde metabólica",
};

export const dietTypeLabels: Record<DietType, string> = {
  onivoro: "Onívoro",
  flexitariano: "Flexitariano",
  pescetariano: "Pescetariano",
  vegetariano: "Vegetariano",
  vegano: "Vegano",
};

export interface DietData {
  nome: string;
  idade: number;
  altura_mm: number;
  peso_kg: number;
  sexo: "masculino" | "feminino";
  nivel_atividade: number;
  objetivo: DietObjective;
  tipo_alimentacao: DietType;
  restricoes_alimentares: string[];
}
