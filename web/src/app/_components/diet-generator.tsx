"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DietData } from "@/types/diet-data";
import { Loader, Pencil, Sparkles } from "lucide-react";
import { useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

export function DietGenerator({
  data,
  onEdit,
}: {
  data: DietData;
  onEdit: () => void;
}) {
  const [output, setOutput] = useState<string>("");
  const [isStreaming, setIsStreaming] = useState<boolean>(false);

  const controllerRef = useRef<AbortController | null>(null);

  function isAbortError(error: unknown) {
    return (
      error instanceof DOMException && error.name === "AbortError"
    ) || (
      error instanceof Error &&
      (error.name === "AbortError" || error.message.includes("aborted"))
    );
  }

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
        body: JSON.stringify(data),
        signal: controller.signal, // Permite abortar a requisição
      });

      if (!response.ok) {
        throw new Error(`Erro ao gerar dieta: ${response.status}`);
      }

      if (!response.body) {
        throw new Error("A resposta não retornou stream");
      }

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
      if (controller.signal.aborted || isAbortError(error)) {
        return;
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
      return;
    }

    await startStreaming();
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-4xl border-0 p-4 md:p-6">
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Button
            className="cursor-pointer gap-2"
            size="lg"
            variant="outline"
            onClick={onEdit}
            disabled={isStreaming}
          >
            <Pencil />
            Editar dados
          </Button>
          <Button
            className="cursor-pointer gap-2"
            size="lg"
            onClick={handleGenerate}
          >
            {isStreaming ? (
              <Loader className="animate-spin" />
            ) : (
              <Sparkles className="w-6 h-6" />
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
