# Documentação do Modelo de Banco de Dados

## Introdução

Este documento descreve a estrutura do banco de dados para a aplicação de formulários dos setores da empresa. Nele estão definidos as tabelas, suas relações, regras de validação e exemplos de uso. O esquema completo pode ser encontrado no arquivo DDL (db_schema.sql) do projeto.

---

## Estrutura das Tabelas

### 1. Tabela `sectors`

**Descrição:**  
Armazena os setores da empresa. Cada setor gerencia um conjunto de questionários.

**Colunas:**

- `id` (UUID, PK) – Identificador único do setor (gerado automaticamente).
- `name` (VARCHAR(100)) – Nome do setor.
- `description` (TEXT) – Descrição do setor.
- `created_at` (TIMESTAMPTZ) – Data/hora de criação do registro.

---

### 2. Tabela `questionnaires`

**Descrição:**  
Armazena os questionários, cada um vinculado a um setor.

**Colunas:**

- `id` (UUID, PK) – Identificador único do questionário (gerado automaticamente).
- `title` (VARCHAR(100)) – Título do questionário.
- `icon` (VARCHAR(50)) – Ícone representativo (opcional).
- `sector_id` (UUID, FK) – Referência ao setor responsável (relaciona com `sectors.id`).
- `created_at` (TIMESTAMPTZ) – Data/hora de criação do registro.

**Relações:**

- Um setor pode ter vários questionários (relação 1:N).

---

### 3. Tabela `questions`

**Descrição:**  
Registra todas as perguntas dos questionários, incluindo perguntas principais e condicionais.

**Colunas:**

- `id` (UUID, PK) – Identificador único da pergunta (gerado automaticamente).
- `questionnaire_id` (UUID, FK) – Referência ao questionário (relaciona com `questionnaires.id`).
- `parent_question_id` (UUID, FK, opcional) – Identificador da pergunta pai, se for uma pergunta condicional.
- `trigger_value` (VARCHAR(50), opcional) – Valor que, quando selecionado na pergunta pai, ativa esta pergunta condicional.
- `order_index` (INT) – Índice de ordenação da pergunta no questionário.
- `text` (TEXT) – Texto da pergunta.
- `type` (VARCHAR(20)) – Tipo da pergunta. Valores válidos: `text`, `textarea`, `radio`, `checkbox`, `date`, `number`.
- `created_at` (TIMESTAMPTZ) – Data/hora de criação do registro.

**Relações:**

- Cada questionário pode ter diversas perguntas (relação 1:N).
- Perguntas condicionais referenciam uma pergunta pai (relação 1:N) e devem pertencer ao mesmo questionário.

---

### 4. Tabela `options`

**Descrição:**  
Armazena as opções de resposta para perguntas do tipo `radio` e `checkbox`.

**Colunas:**

- `id` (UUID, PK) – Identificador único da opção (gerado automaticamente).
- `question_id` (UUID, FK) – Referência à pergunta (relaciona com `questions.id`).
- `label` (VARCHAR(100)) – Texto descritivo da opção.
- `value` (VARCHAR(50)) – Valor associado à opção.
- `created_at` (TIMESTAMPTZ) – Data/hora de criação do registro.

**Relações:**

- Cada pergunta pode ter várias opções (relação 1:N).

---

### 5. Tabela `analytics`

**Descrição:**  
Armazena métricas e indicadores para análise dos questionários, como frequência de exames e tempo médio de resposta.

**Colunas:**

- `id` (UUID, PK) – Identificador único do registro (gerado automaticamente).
- `questionnaire_id` (UUID, FK) – Referência ao questionário analisado (relaciona com `questionnaires.id`).
- `exam_frequency` (INT) – Quantidade de vezes que o questionário foi respondido.
- `average_response_time` (DECIMAL(10,2)) – Tempo médio de resposta (unidade definida conforme o contexto, ex.: minutos).
- `other_indicators` (TEXT) – Outros indicadores ou métricas agregadas.
- `created_at` (TIMESTAMPTZ) – Data/hora de criação do registro.

**Relações:**

- Cada questionário pode ter múltiplos registros de análise (relação 1:N).

---

### 6. Tabela `pdf_files`

**Descrição:**  
Armazena informações dos PDFs gerados a partir dos formulários, incluindo o caminho para download e dados de assinatura.

**Colunas:**

- `id` (UUID, PK) – Identificador único do arquivo PDF (gerado automaticamente).
- `questionnaire_id` (UUID, FK) – Referência ao questionário que gerou o PDF (relaciona com `questionnaires.id`).
- `file_path` (VARCHAR(255)) – Caminho ou URL para o PDF.
- `signature_hash` (VARCHAR(255)) – Hash da assinatura do PDF (para verificação de integridade).
- `signature_at` (TIMESTAMPTZ) – Data/hora em que a assinatura foi realizada.
- `generated_at` (TIMESTAMPTZ) – Data/hora de geração do PDF.
- `created_at` (TIMESTAMPTZ) – Data/hora de criação do registro.

**Relações:**

- Cada questionário pode ter vários PDFs associados (relação 1:N).

---

## Exemplos de Uso

### Criando um Setor

```sql
INSERT INTO sectors (name, description)
VALUES ('Saúde', 'Setor responsável pelos exames médicos.');
```

### Criando um Questionário

```sql
INSERT INTO questionnaires (title, icon, sector_id)
VALUES ('Check-up Anual', 'stethoscope', 'UUID_DO_SETOR');
```

### Criando uma Pergunta

```sql
INSERT INTO questions (questionnaire_id, text, type, order_index)
VALUES ('UUID_DO_QUESTIONARIO', 'Qual sua idade?', 'number', 1);
```

### Criando uma Opção de Resposta

```sql
INSERT INTO options (question_id, label, value)
VALUES ('UUID_DA_PERGUNTA', 'Menos de 18 anos', 'menos_18');
```
