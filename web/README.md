# Web

## 1. Visão Geral

O frontend do Nutri-AI é uma aplicação web construída com **Next.js 16, React 19 e TypeScript**. Ele é responsável por coletar os dados do usuário, disparar a geração do plano alimentar e apresentar o resultado em uma interface simples e direta.

O frontend abstrai a comunicação com a API e transforma o texto gerado pela IA em uma visualização legível.

Principais funcionalidades:

- Formulário com validação para dados do usuário.
- Seleção de sexo, nível de atividade, objetivo, tipo de alimentação e restrições.
- Envio dos dados para a API de geração.
- Consumo de resposta em streaming.
- Renderização da dieta em Markdown.
- Possibilidade de editar os dados ou interromper a geração.

## 2. Arquitetura

O frontend usa o **App Router** do Next.js e uma arquitetura baseada em componentes.

Fluxo principal:

1. A página inicial renderiza o componente `DietFlow`.
2. `DietFlow` exibe o formulário ou a área de geração conforme o estado.
3. O usuário preenche os dados e envia.
4. O componente gerador chama o backend em `POST /plan`.
5. A resposta chega em stream e é acumulada no estado.
6. O Markdown final é exibido na interface.
7. O usuário pode voltar para editar os dados ou interromper a geração durante o streaming.

Diagrama textual:

```text
Home page
  -> DietFlow
  -> DietForm
  -> submit com dados validados
  -> DietGenerator
  -> fetch para backend
  -> stream de texto
  -> ReactMarkdown
  -> plano exibido ao usuário
```

## 3. Tecnologias Utilizadas

### Frontend

- Next.js 16
- React 19
- TypeScript
- React Hook Form
- Zod
- React Markdown
- Lucide React
- Radix UI

### UI e estilos

- Tailwind CSS 4
- Componentes utilitários internos em `src/components/ui`
- `clsx`, `tailwind-merge`, `class-variance-authority`

### Backend consumido

- API HTTP em Fastify rodando por padrão em `http://localhost:3333`

## 4. Estrutura de Pastas

```text
web/
├── public/
├── src/
│   ├── app/
│   │   ├── _components/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   └── ui/
│   ├── lib/
│   └── types/
├── package.json
└── tsconfig.json
```

### Organização

- `src/app/page.tsx`: ponto de entrada da página inicial.
- `src/app/_components/diet-flow.tsx`: controla a troca entre formulário e geração.
- `src/app/_components/diet-form.tsx`: formulário do usuário.
- `src/app/_components/diet-generator.tsx`: integração com a API e renderização do resultado.
- `src/components/ui/`: componentes reutilizáveis de interface.
- `src/types/`: contratos TypeScript compartilhados localmente no frontend.
- `src/lib/`: utilitários.

## 5. Setup do Projeto

### Pré-requisitos

- Node.js 20 ou superior
- npm
- Backend em execução na porta `3333`

### Instalação

```bash
cd web
npm install
npm run dev
```

A aplicação ficará disponível em `http://localhost:3000`.

## 6. Variáveis de Ambiente

Atualmente o frontend **não exige variáveis de ambiente**.

Observação importante:

- A URL da API está fixa no código como `http://localhost:3333/plan`.
- Em produção, o ideal é substituir esse valor por uma variável como `NEXT_PUBLIC_API_URL`.

## 7. Scripts Disponíveis

- `npm run dev`: inicia o ambiente de desenvolvimento.
- `npm run build`: gera a build de produção.
- `npm run start`: executa a build em produção.

## 8. Estrutura da Interface

### Componentes principais

#### `DietForm`

Responsável por:

- capturar os dados do usuário;
- validar os campos com Zod;
- integrar com React Hook Form;
- disparar o fluxo de geração;
- agrupar restrições alimentares como tags removíveis;
- limpar o formulário quando solicitado.

Campos coletados:

- `nome`
- `idade`
- `peso_kg`
- `altura_mm`
- `sexo`
- `nivel_atividade`
- `objetivo`
- `tipo_alimentacao`
- `restricoes_alimentares`

#### `DietGenerator`

Responsável por:

- enviar os dados ao backend;
- controlar estado de carregamento;
- abortar a geração quando necessário;
- renderizar o Markdown recebido.

#### `DietFlow`

Responsável por:

- manter o estado do formulário enviado;
- alternar entre edição e geração;
- permitir voltar para editar dados sem recarregar a página.

### Hooks e estado

O frontend usa:

- `useState` para armazenar dados do formulário e saída da geração;
- `useRef` para manter o `AbortController`;
- `useForm` e `Controller` para integração entre formulário e componentes controlados.

### Services

Não existe uma camada de service separada no estado atual. A chamada HTTP ao backend está implementada diretamente em `diet-generator.tsx`.

## 9. Fluxo da Aplicação

Fluxo do usuário:

1. O usuário acessa a página inicial.
2. Preenche os dados pessoais.
3. Clica em "Gerar minha dieta".
4. A aplicação troca do formulário para a área de geração.
5. O usuário inicia a chamada ao backend.
6. A resposta é exibida gradualmente.
7. O usuário pode interromper a geração durante o streaming.
8. O usuário pode voltar para editar os dados.

Integração com API:

- Método: `POST`
- URL: `http://localhost:3333/plan`
- Tipo de resposta: stream textual em Markdown

Exemplo de payload:

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

## 10. Banco de Dados

O frontend não possui integração com banco de dados. Toda a experiência depende exclusivamente da API backend.

## 11. Boas Práticas Adotadas

- Tipagem forte para dados da aplicação.
- Validação de formulário com schema declarativo.
- Componentização de interface.
- Separação entre formulário, alternância de fluxo e renderização do resultado.
- Reaproveitamento de componentes de UI.

## 12. Como Rodar o Frontend

```bash
cd web
npm install
npm run dev
```

Com o backend rodando, acesse `http://localhost:3000`.

## 13. Troubleshooting

### Botão gera requisição, mas não retorna resultado

Verifique se o backend está ativo em `http://localhost:3333`.

### Erro de CORS

Confirme se o backend foi iniciado corretamente com o plugin de CORS.

### Build falha por dependências

Execute novamente `npm install` e confirme a versão do Node.js.

### Produção com URL incorreta da API

Hoje a URL está hardcoded. Ajuste o código para usar variável de ambiente antes de publicar.

## 14. Próximos Passos / Melhorias

- Criar camada de serviços para chamadas HTTP.
- Externalizar configuração da URL da API.
- Melhorar feedback visual para estados de erro.
- Adicionar testes de componentes e fluxo.
- Permitir reiniciar o formulário sem recarregar a página.
