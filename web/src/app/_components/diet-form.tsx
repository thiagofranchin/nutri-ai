"use client";

import { z } from "zod";
import { Card } from "@/components/ui/card";
import { Utensils } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldContent,
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
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";

const dietSchema = z.object({
  nome: z.string().min(2, "O nome é obrigatório"),
  idade: z.number().int().positive(),
  altura_cm: z.number().positive(),
  peso_kg: z.number().positive(),
  sexo: z.enum(["masculino", "feminino"], { message: "Selecione o sexo" }),
  nivel_atividade: z.enum(["sedentario", "2x_semana", "4x_semana"], {
    message: "Selecione o nível de atividade",
  }),
  objetivo: z.enum(["perda_de_peso", "hipertrofia", "manter_massa_muscular"], {
    message: "Selecione o objetivo",
  }),
});

type DietSchemaFormData = z.infer<typeof dietSchema>;

interface DietformProps {
  onSubmit: (data: DietSchemaFormData) => void;
}

export function DietForm({ onSubmit }: DietformProps) {
  const form = useForm<DietSchemaFormData>({
    resolver: zodResolver(dietSchema),
    defaultValues: {
      nome: "",
      idade: undefined,
      altura_cm: undefined,
      peso_kg: undefined,
      sexo: undefined,
      nivel_atividade: undefined,
      objetivo: undefined,
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full lg:w-2/3 max-w-2x1 border-0">
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
                name="altura_cm"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Altura em cm</FieldLabel>
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
                        placeholder="Ex: 1,75"
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
                        value={field.value}
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

            {/* CAMPOS ATIVIDADE E NIVEL */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                control={form.control}
                name="nivel_atividade"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                      Nível de atividade
                    </FieldLabel>
                    <FieldContent>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        name={field.name}
                      >
                        <SelectTrigger
                          id={field.name}
                          className="w-full"
                          aria-invalid={fieldState.invalid}
                        >
                          <SelectValue placeholder="Selecione o nível de atividade" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sedentario">Sedentário</SelectItem>
                          <SelectItem value="2x_semana">
                            2x por semana
                          </SelectItem>
                          <SelectItem value="4x_semana">
                            4x por semana
                          </SelectItem>
                        </SelectContent>
                      </Select>
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
                        value={field.value}
                        onValueChange={field.onChange}
                        name={field.name}
                      >
                        <SelectTrigger
                          id={field.name}
                          className="w-full"
                          aria-invalid={fieldState.invalid}
                        >
                          <SelectValue placeholder="Selecione o seu objetivo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="perda_de_peso">
                            Perda de peso
                          </SelectItem>
                          <SelectItem value="hipertrofia">
                            Hipertrofia
                          </SelectItem>
                          <SelectItem value="manter_massa_muscular">
                            Manter massa muscular
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FieldError errors={[fieldState.error]} />
                    </FieldContent>
                  </Field>
                )}
              />
            </div>

            <Button className="w-full mt-6 hover:opacity-90 cursor-pointer">
              Gerar minha dieta
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
