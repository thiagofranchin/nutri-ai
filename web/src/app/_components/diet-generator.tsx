"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DietData } from "@/types/diet-data";
import { Loader, Sparkles } from "lucide-react";
import { useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

export function DietGenerator({ data }: { data: DietData }) {
  const [output, setOutput] = useState<string>("");
  const [isStreaming, setIsStreaming] = useState<boolean>(false);

  const controllerRef = useRef<AbortController | null>(null);

  async function startStreaming() {
    const controller = new AbortController();
    controllerRef.current = controller;

    setIsStreaming(true);
    setOutput("");

    try {
      const response = await fetch("http://localhost:3333/plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: data.nome,
          idade: data.idade,
          altura_cm: data.altura_cm,
          peso_kg: data.peso_kg,
          sexo: data.sexo,
          nivel_atividade: data.nivel_atividade,
          objetivo: data.objetivo,
        }),
        signal: controller.signal, // Permite abortar a requisição
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder("utf-8");

      while (true) {
        const { value, done } = await reader!.read();
        if (done) break;

        /**
         * Atualiza o estado com o novo texto recebido. Usamos a função de atualização
         * anterior para garantir que não sobrescrevemos o texto já recebido,
         * mas sim concatenamos o novo texto ao final do existente.
         */
        setOutput((prev) => prev + decoder.decode(value));
      }
    } catch (error) {
      if (controller.signal.aborted) {
        console.log("Streaming abortado");
      }

      console.error("Erro no streaming:", error);
    } finally {
      setIsStreaming(false);
      controllerRef.current = null;
    }
  }

  async function handleGenerate() {
    if (isStreaming) {
      controllerRef.current?.abort();
      setIsStreaming(false);
      return;
    }

    await startStreaming();
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-4xl border-0 p-4 md:p-6">
        <div className="flex justify-center gap-4">
          <Button
            className="cursor-pointer gap-2"
            size="lg"
            onClick={handleGenerate}
          >
            {isStreaming ? (
              <Loader className="animate-spin" />
            ) : (
              <Sparkles name="w-6 h-6" />
            )}
            {isStreaming ? "Parar dieta" : "Gerar dieta"}
          </Button>
        </div>

        {output && (
          <div className="bg-card rounded-lg p-6 border border-border max-h-125 overflow-y-auto">
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown
                components={{
                  h2: ({ node, ...props }) => (
                    <h2
                      className="text-xl font-bold text-green-600 my-1"
                      {...props}
                    />
                  ),
                  h1: ({ node, ...props }) => (
                    <h1
                      className="text-2xl font-bold text-zinc-900 mb-1"
                      {...props}
                    />
                  ),
                }}
              >
                {output}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
