"use client";

import { useState } from "react";
import { z } from "zod";
import { Card } from "@/components/ui/card";
import { Utensils, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Controller, type DefaultValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  dietObjectiveLabels,
  dietObjectiveValues,
  DietData,
  dietTypeLabels,
  dietTypeValues,
} from "@/types/diet-data";

const dietSchema = z.object({
  nome: z.string().min(2, "O nome é obrigatório"),
  idade: z.number().int().positive("A idade deve ser maior que zero"),
  altura_mm: z.number().int().positive("A altura deve ser maior que zero"),
  peso_kg: z.number().positive("O peso deve ser maior que zero"),
  sexo: z.enum(["masculino", "feminino"], { message: "Selecione o sexo" }),
  nivel_atividade: z
    .number()
    .int()
    .min(1, "Selecione entre 1 e 7 dias")
    .max(7, "Selecione entre 1 e 7 dias"),
  objetivo: z.enum(dietObjectiveValues, {
    message: "Selecione o objetivo",
  }),
  tipo_alimentacao: z.enum(dietTypeValues, {
    message: "Selecione o tipo de alimentação",
  }),
  restricoes_alimentares: z.array(z.string()),
});

type DietSchemaFormData = z.infer<typeof dietSchema>;

const emptyFormValues: DefaultValues<DietSchemaFormData> = {
  nome: "",
  idade: undefined,
  altura_mm: undefined,
  peso_kg: undefined,
  sexo: undefined,
  nivel_atividade: 3,
  objetivo: undefined,
  tipo_alimentacao: undefined,
  restricoes_alimentares: [],
};

interface DietformProps {
  onSubmit: (data: DietData) => void;
  initialValues?: DietData | null;
  onClear?: () => void;
}

export function DietForm({ onSubmit, initialValues, onClear }: DietformProps) {
  const [restricoesInput, setRestricoesInput] = useState("");
  const [resetVersion, setResetVersion] = useState(0);
  const form = useForm<DietSchemaFormData>({
    resolver: zodResolver(dietSchema),
    defaultValues: {
      ...emptyFormValues,
      ...initialValues,
    },
  });

  const restricoes = form.watch("restricoes_alimentares") ?? [];

  function sanitizeTag(value: string) {
    return value.trim().replace(/\s+/g, " ");
  }

  function parseTags(value: string) {
    return value.split(",").map(sanitizeTag).filter(Boolean);
  }

  function mergeUniqueTags(current: string[], incoming: string[]) {
    const unique = new Map<string, string>();

    [...current, ...incoming].forEach((tag) => {
      const normalized = tag.toLocaleLowerCase("pt-BR");
      if (!unique.has(normalized)) {
        unique.set(normalized, tag);
      }
    });

    return Array.from(unique.values());
  }

  function commitRestricoes(rawValue: string) {
    const parsed = parseTags(rawValue);

    if (parsed.length === 0) {
      setRestricoesInput("");
      return;
    }

    form.setValue(
      "restricoes_alimentares",
      mergeUniqueTags(restricoes, parsed),
      { shouldDirty: true, shouldValidate: true },
    );
    setRestricoesInput("");
  }

  function removeRestricao(tagToRemove: string) {
    form.setValue(
      "restricoes_alimentares",
      restricoes.filter((tag) => tag !== tagToRemove),
      { shouldDirty: true, shouldValidate: true },
    );
  }

  function handleClear() {
    form.reset(emptyFormValues);
    setRestricoesInput("");
    setResetVersion((current) => current + 1);
    onClear?.();
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full lg:w-2/3 max-w-3xl border-0">
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4 mx-auto">
              <Utensils className="w-14 h-14 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold text-green-500 mb-2">
              Calcule sua dieta
            </h1>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                Dados pessoais
              </h3>
            </div>

            {/* CAMPOS NOME E IDADE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                control={form.control}
                name="nome"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Nome</FieldLabel>
                    <FieldContent>
                      <Input
                        {...field}
                        id={field.name}
                        placeholder="Digite seu nome..."
                        aria-invalid={fieldState.invalid}
                      />
                      <FieldError errors={[fieldState.error]} />
                    </FieldContent>
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="idade"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Idade</FieldLabel>
                    <FieldContent>
                      <Input
                        id={field.name}
                        type="number"
                        step="1"
                        value={field.value ?? ""}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? undefined
                              : Number(e.target.value),
                          )
                        }
                        placeholder="Ex: 27"
                        aria-invalid={fieldState.invalid}
                      />
                      <FieldError errors={[fieldState.error]} />
                    </FieldContent>
                  </Field>
                )}
              />
            </div>

            {/* CAMPOS PESO, SEXO E ALTURA */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Controller
                control={form.control}
                name="peso_kg"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Peso em kg</FieldLabel>
                    <FieldContent>
                      <Input
                        id={field.name}
                        type="number"
                        step="any"
                        value={field.value ?? ""}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? undefined
                              : Number(e.target.value),
                          )
                        }
                        placeholder="Ex: 70"
                        aria-invalid={fieldState.invalid}
                      />
                      <FieldError errors={[fieldState.error]} />
                    </FieldContent>
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="altura_mm"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Altura em mm</FieldLabel>
                    <FieldContent>
                      <Input
                        id={field.name}
                        type="number"
                        step="1"
                        value={field.value ?? ""}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? undefined
                              : Number(e.target.value),
                          )
                        }
                        placeholder="Ex: 175"
                        aria-invalid={fieldState.invalid}
                      />
                      <FieldError errors={[fieldState.error]} />
                    </FieldContent>
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="sexo"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Sexo</FieldLabel>
                    <FieldContent>
                      <Select
                        key={`sexo-${resetVersion}`}
                        value={field.value ?? undefined}
                        onValueChange={field.onChange}
                        name={field.name}
                      >
                        <SelectTrigger
                          id={field.name}
                          className="w-full"
                          aria-invalid={fieldState.invalid}
                        >
                          <SelectValue placeholder="Selecione o sexo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="masculino">Masculino</SelectItem>
                          <SelectItem value="feminino">Feminino</SelectItem>
                        </SelectContent>
                      </Select>
                      <FieldError errors={[fieldState.error]} />
                    </FieldContent>
                  </Field>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                control={form.control}
                name="nivel_atividade"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Nível de atividade</FieldLabel>
                    <FieldContent>
                      <RadioGroup
                        value={String(field.value)}
                        onValueChange={(value) => field.onChange(Number(value))}
                        className="flex flex-wrap gap-2"
                        aria-label="Selecione quantos dias por semana você pratica atividade física"
                      >
                        {Array.from({ length: 7 }, (_, index) => index + 1).map(
                          (day) => {
                            const id = `nivel-atividade-${day}`;
                            const selected = field.value === day;

                            return (
                              <div key={day}>
                                <RadioGroupItem
                                  id={id}
                                  value={String(day)}
                                  className="peer sr-only"
                                  aria-label={`${day} ${day === 1 ? "dia" : "dias"} por semana`}
                                />
                                <label
                                  htmlFor={id}
                                  className={[
                                    "flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border text-sm font-semibold transition-colors sm:h-10 sm:w-10",
                                    "peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring",
                                    selected
                                      ? "border-primary bg-primary text-primary-foreground"
                                      : "border-border bg-background text-foreground hover:border-primary/50",
                                  ].join(" ")}
                                >
                                  {day}
                                </label>
                              </div>
                            );
                          },
                        )}
                      </RadioGroup>
                      <FieldDescription>
                        Selecione quantos dias por semana você treina.
                      </FieldDescription>
                      <FieldError errors={[fieldState.error]} />
                    </FieldContent>
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="objetivo"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Objetivo</FieldLabel>
                    <FieldContent>
                      <Select
                        key={`objetivo-${resetVersion}`}
                        value={field.value ?? undefined}
                        onValueChange={field.onChange}
                        name={field.name}
                      >
                        <SelectTrigger
                          id={field.name}
                          className="w-full"
                          aria-invalid={fieldState.invalid}
                        >
                          <SelectValue placeholder="Selecione o objetivo" />
                        </SelectTrigger>
                        <SelectContent>
                          {dietObjectiveValues.map((objective) => (
                            <SelectItem key={objective} value={objective}>
                              {dietObjectiveLabels[objective]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FieldError errors={[fieldState.error]} />
                    </FieldContent>
                  </Field>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                control={form.control}
                name="tipo_alimentacao"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                      Tipo de alimentação
                    </FieldLabel>
                    <FieldContent>
                      <Select
                        key={`tipo-alimentacao-${resetVersion}`}
                        value={field.value ?? undefined}
                        onValueChange={field.onChange}
                        name={field.name}
                      >
                        <SelectTrigger
                          id={field.name}
                          className="w-full"
                          aria-invalid={fieldState.invalid}
                        >
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          {dietTypeValues.map((dietType) => (
                            <SelectItem key={dietType} value={dietType}>
                              {dietTypeLabels[dietType]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FieldError errors={[fieldState.error]} />
                    </FieldContent>
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="restricoes_alimentares"
                render={({ fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="restricoes_alimentares">
                      Restrições alimentares
                    </FieldLabel>
                    <FieldContent>
                      <Input
                        id="restricoes_alimentares"
                        value={restricoesInput}
                        onChange={(e) => setRestricoesInput(e.target.value)}
                        onBlur={() => commitRestricoes(restricoesInput)}
                        onKeyDown={(e) => {
                          if (e.key === "," || e.key === "Enter") {
                            e.preventDefault();
                            commitRestricoes(restricoesInput);
                          }
                        }}
                        placeholder="Ex: lactose, glúten, amendoim"
                        aria-invalid={fieldState.invalid}
                      />
                      <FieldDescription>
                        Separe cada item por vírgula. As tags são enviadas como
                        lista para a API.
                      </FieldDescription>
                      {restricoes.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                          {restricoes.map((tag) => (
                            <Badge key={tag}>
                              {tag}
                              <button
                                type="button"
                                className="inline-flex cursor-pointer items-center"
                                onClick={() => removeRestricao(tag)}
                                aria-label={`Remover restrição ${tag}`}
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                      <FieldError errors={[fieldState.error]} />
                    </FieldContent>
                  </Field>
                )}
              />
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Button
                type="button"
                variant="outline"
                className="cursor-pointer"
                onClick={handleClear}
              >
                Limpar
              </Button>
              <Button className="hover:opacity-90 cursor-pointer">
                Gerar minha dieta
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}
