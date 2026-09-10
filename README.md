# Sistema de Gerenciamento de Academia

Aplicacao web para gerenciamento de uma academia, desenvolvida com Java Spring Boot no backend e React no frontend. O sistema permite o cadastro de alunos, simulacao de pagamentos, controle de acesso via catraca e acompanhamento de frequencia.

---

## Visao Geral

O projeto e dividido em dois modulos independentes:

- `academia-backend` — API REST desenvolvida em Java com Spring Boot e banco de dados H2 em memoria
- `academia-frontend` — Interface web desenvolvida em React com Vite

### Funcionalidades

**Fluxo do Aluno**
- Selecao de plano (Basico, Intermediario ou Premium)
- Cadastro com dados pessoais
- Simulacao de passagem pela catraca com validacao de acesso

**Painel Administrativo**
- Cadastro, edicao e exclusao de alunos
- Registro de pagamento com forma de pagamento simulada
- Monitoramento de acessos do dia na catraca
- Filtro de frequencia por aluno e periodo com grafico de acessos por dia

### Regras de Negocio

- O acesso e negado se o aluno estiver inativo, com pagamento pendente ou vencido
- Planos com limite de frequencia diaria bloqueiam o acesso ao atingir o limite
- O plano Premium nao possui restricao de frequencia diaria
- Acessos negados tambem sao registrados com o motivo

---

## Tecnologias

| Camada     | Tecnologia                          |
|------------|-------------------------------------|
| Backend    | Java 17, Spring Boot 3.2, Spring Data JPA |
| Banco      | H2 (em memoria, reiniciado a cada execucao) |
| Frontend   | React 18, Vite, Recharts            |
| Estilizacao | CSS Modules                        |

---

## Pre-requisitos

- Java 17 ou superior
- Maven 3.8 ou superior
- Node.js 18 ou superior
- npm

---

## Como Executar

### Backend

```bash
cd academia-backend
mvn spring-boot:run
```

A API ficara disponivel em `http://localhost:8080`.

O banco H2 pode ser acessado em `http://localhost:8080/h2-console` com as configuracoes:

```
JDBC URL:  jdbc:h2:mem:academia
Username:  sa
Password:  (vazio)
```

Tres alunos de exemplo sao inseridos automaticamente na inicializacao.

### Frontend

```bash
cd academia-frontend
npm install
npm run dev
```

A interface ficara disponivel em `http://localhost:5173`.

O backend precisa estar em execucao para que as requisicoes funcionem.

---

## Endpoints da API

### Alunos

| Metodo | Rota                    | Descricao                        | Status de retorno     |
|--------|-------------------------|----------------------------------|-----------------------|
| GET    | `/alunos`               | Lista todos os alunos            | 200                   |
| GET    | `/alunos/{id}`          | Busca aluno por ID               | 200 / 404             |
| POST   | `/alunos`               | Cadastra novo aluno              | 201 / 400             |
| PUT    | `/alunos/{id}`          | Atualiza dados do aluno          | 200 / 400 / 404       |
| DELETE | `/alunos/{id}`          | Remove aluno                     | 204 / 404             |
| POST   | `/alunos/{id}/pagar`    | Registra pagamento               | 200 / 404             |

### Catraca

| Metodo | Rota                              | Descricao                              | Status de retorno |
|--------|-----------------------------------|----------------------------------------|-------------------|
| POST   | `/catraca/acesso`                 | Registra tentativa de acesso           | 201 / 400         |
| GET    | `/catraca/acessos/hoje`           | Lista acessos do dia                   | 200               |
| GET    | `/catraca/acessos/aluno/{id}`     | Lista acessos de um aluno por periodo  | 200 / 400         |

### Planos

| Metodo | Rota       | Descricao              | Status de retorno |
|--------|------------|------------------------|-------------------|
| GET    | `/planos`  | Lista os planos fixos  | 200               |

---

## Planos Disponiveis

| Plano         | Valor mensal | Limite diario |
|---------------|--------------|---------------|
| Basico        | R$ 80,00     | 3 entradas    |
| Intermediario | R$ 120,00    | 5 entradas    |
| Premium       | R$ 200,00    | Ilimitado     |

---

## Estrutura do Projeto

```
academia-sistema/
  academia-backend/
    src/main/java/com/academia/
      config/          configuracao de CORS
      controller/      controladores REST
      model/           entidades JPA e enums
      repository/      interfaces de acesso ao banco
      service/         regras de negocio
    src/main/resources/
      application.properties
  academia-frontend/
    src/
      api.js           funcoes de requisicao HTTP
      components/      componentes reutilizaveis (Navbar)
      pages/           paginas da aplicacao
      styles/          CSS Modules por componente
```
