# Nutri-AI

## 1. Visão Geral

O **Nutri-AI** é um projeto fullstack para geração de planos alimentares personalizados com apoio de IA. A aplicação coleta dados no frontend, envia essas informações para a API no backend e retorna um plano semanal em Markdown.

O objetivo do projeto é transformar dados simples do usuário em uma sugestão de cardápio organizada e objetiva, sem exigir que a dieta seja montada manualmente.

Principais funcionalidades:

- Coleta de dados pessoais, objetivo alimentar, tipo de alimentação e restrições.
- Validação dos dados enviados pelo usuário.
- Geração de dieta com IA a partir de regras de negócio e diretrizes nutricionais.
- Streaming da resposta do backend para o frontend.
- Exibição formatada do plano alimentar no navegador.

## 2. Arquitetura

O projeto segue uma arquitetura **fullstack em monorepo simples**, separada em duas pastas principais:

- `backend/`: API HTTP responsável por validar a entrada, montar prompts e consumir a OpenAI.
- `web/`: interface web em Next.js responsável por coletar os dados e renderizar a dieta gerada.

Fluxo entre frontend e backend:

1. O usuário preenche o formulário na interface web.
2. O frontend envia um `POST /plan` para o backend.
3. O backend valida o payload com Zod.
4. O backend combina os dados do usuário com regras fixas e um documento de diretrizes nutricionais.
5. A OpenAI gera a resposta em streaming.
6. O backend repassa os chunks ao frontend.
7. O frontend acumula o texto e renderiza o resultado em Markdown.

Diagrama textual:

```text
Usuário
  -> Web (Next.js / React)
  -> Formulário de dieta
  -> POST /plan
  -> Backend (Fastify)
  -> Validação + Prompt + Documento técnico
  -> OpenAI API
  -> Resposta em streaming
  -> Web renderiza Markdown
  -> Usuário visualiza plano semanal
```

## 3. Tecnologias Utilizadas

### Backend

- Node.js
- TypeScript
- Fastify
- Zod
- OpenAI SDK
- TSX

### Frontend

- Next.js 16
- React 19
- TypeScript
- React Hook Form
- Zod
- React Markdown
- Lucide React
- Radix UI
- Componentes utilitários de UI

### Banco de dados

O projeto **não possui banco de dados** no estado atual. Toda a geração é feita sob demanda, sem persistência local de usuários, histórico ou planos alimentares.

### Outras ferramentas

- Tailwind CSS 4
- PostCSS
- CORS no backend

## 4. Estrutura de Pastas

```text
.
├── backend/
│   ├── knowledge/
│   └── src/
└── web/
    ├── public/
    └── src/
```

Explicação:

- `backend/`: serviço da API e orquestração da geração da dieta.
- `backend/knowledge/`: documentos usados como base técnica para enriquecer o prompt.
- `backend/src/`: servidor, rotas, tipos e construção de prompts.
- `web/`: aplicação frontend.
- `web/src/app/`: páginas e componentes principais da interface.
- `web/src/components/`: componentes de UI reutilizáveis.

## 5. Setup do Projeto

### Pré-requisitos

- Node.js 20 ou superior
- npm
- Chave de API da OpenAI

### Instalação

1. Clonar o repositório:

```bash
git clone <url-do-repositorio>
cd dietas
```

2. Instalar dependências do backend:

```bash
cd backend
npm install
```

3. Criar o arquivo `backend/.env`:

```env
PORT=3333
OPENAI_API_KEY=sua_chave_aqui
```

4. Instalar dependências do frontend:

```bash
cd ../web
npm install
```

5. Subir o backend:

```bash
cd ../backend
npm run dev
```

6. Subir o frontend:

```bash
cd ../web
npm run dev
```

## 6. Variáveis de Ambiente (.env)

Atualmente, apenas o backend depende de variáveis obrigatórias:

| Variável | Obrigatória | Descrição |
| --- | --- | --- |
| `PORT` | Não | Porta HTTP do backend. Se omitida, o servidor usa `3333`. |
| `OPENAI_API_KEY` | Sim | Chave usada para autenticar chamadas à API da OpenAI. |

Observações:

- Não exponha a chave da OpenAI no frontend.
- O frontend não usa `.env` no estado atual.
- A URL da API está fixada no código do web como `http://localhost:3333/plan`.

## 7. Scripts Disponíveis

### Backend

- `npm run dev`: inicia o backend em modo desenvolvimento com `tsx watch`.

### Web

- `npm run dev`: inicia o frontend com Next.js.
- `npm run build`: gera a build de produção.
- `npm run start`: sobe a aplicação Next.js em modo produção.

## 8. Backend

Resumo: o backend é uma API HTTP simples em Fastify que valida o corpo da requisição, prepara os prompts e transmite a resposta gerada pela OpenAI.

Documentação específica: [backend/README.md](backend/README.md)

## 9. Frontend

Resumo: o frontend é uma aplicação Next.js com uma jornada curta de formulário, envio e renderização do plano alimentar em Markdown.

Documentação específica: [web/README.md](web/README.md)

## 10. Banco de Dados

Não existe banco de dados no estado atual do projeto.

Implicações práticas:

- Não há persistência de usuários.
- Não há histórico de dietas geradas.
- Não há autenticação, sessões ou perfis salvos.

## 11. Boas Práticas Adotadas

- Separação clara entre frontend e backend.
- Validação de entrada com schema tipado usando Zod.
- Tipagem TypeScript nas duas camadas.
- Componentização da UI no frontend.
- Regras de geração encapsuladas no backend.
- Uso de um documento técnico externo para reduzir lógica hardcoded no prompt principal.

## 12. Como Rodar o Projeto

Resumo rápido para desenvolvimento:

```bash
cd backend
npm install
npm run dev
```

Em outro terminal:

```bash
cd web
npm install
npm run dev
```

Depois acesse `http://localhost:3000`.

## 13. Troubleshooting

### Erro de autenticação com OpenAI

Verifique se `OPENAI_API_KEY` está definida corretamente no `.env` do backend.

### Frontend não consegue gerar dieta

Confirme se o backend está rodando em `http://localhost:3333`, porque a chamada é feita para `http://localhost:3333/plan`.

### Porta em uso

Altere a variável `PORT` no backend ou finalize o processo que já está usando a porta.

### Resposta não aparece no frontend

Verifique:

- se o backend iniciou sem erro;
- se a requisição `POST /plan` está chegando;
- se a chave da OpenAI é válida;
- se o navegador não bloqueou a chamada por ambiente incorreto.

## 14. Próximos Passos / Melhorias

- Externalizar a URL da API para variável de ambiente no frontend.
- Padronizar o streaming como SSE completo ou ajustar o `Content-Type` para texto simples em stream.
- Adicionar tratamento visual de erro no frontend.
- Incluir testes automatizados para validação, rotas e componentes.
- Adicionar persistência para histórico de dietas.
