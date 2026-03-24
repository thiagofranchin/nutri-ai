# Backend

## 1. Visão Geral

O backend do projeto Nutri-AI é uma API HTTP construída com **Node.js, TypeScript e Fastify**. Sua responsabilidade é receber os dados do usuário, validar o payload, montar o contexto da geração e intermediar a comunicação com a OpenAI.

Esse serviço centraliza as regras de negócio e evita que a lógica de geração de dietas fique exposta no frontend.

Principais responsabilidades:

- Expor endpoints HTTP para teste e geração de dieta.
- Validar dados recebidos com Zod.
- Carregar diretrizes nutricionais do projeto.
- Montar prompts de sistema e de usuário.
- Consumir a OpenAI com resposta em streaming.

## 2. Arquitetura

O backend segue uma estrutura enxuta, próxima de um serviço API em camadas simples:

- `server.ts`: inicialização do Fastify e registro de plugins/rotas.
- `routes/plan.ts`: definição da rota principal de geração.
- `types.ts`: contrato de entrada da API.
- `prompt.ts`: construção dos prompts.
- `agent.ts`: integração com a OpenAI.
- `knowledge/`: base documental usada como contexto.

Diagrama textual:

```text
Cliente HTTP
  -> Fastify
  -> Rota POST /plan
  -> Validação Zod
  -> buildSystemPrompt + buildUserPrompt + documento técnico
  -> OpenAI API
  -> chunks de resposta
  -> cliente recebe texto em stream
```

## 3. Tecnologias Utilizadas

- Node.js
- TypeScript
- Fastify
- `@fastify/cors`
- Zod
- OpenAI SDK
- TSX

## 4. Estrutura de Pastas

```text
backend/
├── knowledge/
│   └── diretrizes.md
├── src/
│   ├── agent.ts
│   ├── prompt.ts
│   ├── server.ts
│   ├── types.ts
│   └── routes/
│       └── plan.ts
├── package.json
└── tsconfig.json
```

### Responsabilidade por diretório

- `knowledge/`: diretrizes nutricionais de referência.
- `src/agent.ts`: cliente OpenAI e streaming da geração.
- `src/prompt.ts`: regras fixas e interpolação de dados do usuário.
- `src/routes/plan.ts`: endpoint principal.
- `src/types.ts`: schema e tipo do request.

## 5. Setup do Projeto

### Pré-requisitos

- Node.js 20 ou superior
- npm
- `OPENAI_API_KEY`

### Instalação

```bash
cd backend
npm install
```

Crie o arquivo `.env`:

```env
PORT=3333
OPENAI_API_KEY=sua_chave_aqui
```

Inicie em desenvolvimento:

```bash
npm run dev
```

## 6. Variáveis de Ambiente

| Variável         | Obrigatória | Descrição                                             |
| ---------------- | ----------- | ----------------------------------------------------- |
| `PORT`           | Não         | Porta de execução da API. Se omitida, usa `3333`.    |
| `OPENAI_API_KEY` | Sim         | Chave de autenticação da OpenAI.                     |

## 7. Scripts Disponíveis

- `npm run dev`: sobe a API em modo watch usando `tsx`.

## 8. Endpoints Principais

### `GET /test`

Endpoint simples de saúde/teste.

Resposta:

```json
{
  "message": "Hello, World!"
}
```

### `POST /plan`

Gera um plano alimentar personalizado com base nos dados do usuário.

Payload atual usado pelo frontend:

```json
{
  "nome": "Thiago",
  "idade": 27,
  "altura_mm": 175,
  "peso_kg": 70,
  "sexo": "masculino",
  "nivel_atividade": 4,
  "objetivo": "ganho_de_massa",
  "tipo_alimentacao": "onivoro",
  "restricoes_alimentares": ["lactose", "glúten"]
}
```

Campos aceitos:

| Campo | Tipo | Regra |
| --- | --- | --- |
| `nome` | string | mínimo de 2 caracteres |
| `idade` | number | inteiro positivo |
| `altura_mm` | number | inteiro positivo |
| `peso_kg` | number | valor positivo |
| `sexo` | enum | `masculino` ou `feminino` |
| `nivel_atividade` | number | inteiro entre 1 e 7. Por compatibilidade, aceita `sedentario`, `2x_semana` e `4x_semana`. |
| `objetivo` | enum | `perda_de_peso`, `ganho_de_massa`, `manutencao`, `melhora_de_performance`, `saude_metabolica`. Por compatibilidade, aceita `hipertrofia` e `manter_massa_muscular`. |
| `tipo_alimentacao` | enum | `onivoro`, `flexitariano`, `pescetariano`, `vegetariano`, `vegano` |
| `restricoes_alimentares` | array | lista de strings sanitizadas; padrão vazio |

Resposta:

- Tipo: stream textual.
- Conteúdo: Markdown gerado pela IA.

Erro de validação:

```json
{
  "error": "ValidationError",
  "details": {
    "fieldErrors": {}
  }
}
```

## 9. Regras de Negócio Principais

O backend impõe regras claras antes da resposta ser gerada:

- A resposta deve ser em Markdown legível.
- O plano precisa conter exatamente 7 dias.
- Cada dia deve conter 4 refeições fixas:
  - café da manhã
  - almoço
  - lanche
  - jantar
- A dieta deve priorizar ingredientes comuns no Brasil.
- A resposta não deve ser JSON.
- A resposta não deve incluir calorias, macros ou observações genéricas de consulta profissional.
- O tipo de alimentação informado pelo usuário deve ser respeitado.
- Ingredientes presentes nas restrições alimentares não devem aparecer no plano.

Além dessas regras, o backend injeta no contexto um documento com diretrizes de macronutrientes para objetivos como ganho de massa, emagrecimento, manutenção e saúde metabólica.

## 10. Banco de Dados

Não há banco de dados nem persistência de estado.

Consequências:

- cada requisição é independente;
- não existe histórico de dietas;
- não há controle de usuários.

## 11. Boas Práticas Adotadas

- Validação de entrada com schema centralizado.
- Separação de responsabilidades entre rota, tipos, prompt e integração externa.
- Tipagem explícita no contrato de entrada.
- Base de conhecimento desacoplada do código da rota.

## 12. Como Rodar o Backend

```bash
cd backend
npm install
npm run dev
```

API disponível por padrão em `http://localhost:3333`.

## 13. Troubleshooting

### `401` ou falha de autenticação na OpenAI

Revise a variável `OPENAI_API_KEY`.

### Erro ao iniciar o servidor

Verifique se a porta definida em `PORT` já está em uso.

### Erro de validação no `POST /plan`

Confirme se todos os campos numéricos estão sendo enviados como número e se os enums respeitam os valores aceitos.

### Resposta interrompida no meio

Pode haver timeout, cancelamento do cliente ou falha externa na chamada do modelo.

## 14. Próximos Passos / Melhorias

- Definir contrato de streaming de forma mais consistente.
- Criar testes automatizados para schema, rotas e integração.
- Externalizar configuração de modelo via ambiente.
- Adicionar logs estruturados e observabilidade.
- Introduzir persistência para auditoria e histórico de uso.
