# Future A.I — Sistema de Análise de Crédito. 
# UCB - SQUAD 11.

# Integrantes: 
- Yasmin Gabrielly 
- Victor De Jesus
- Tais Barbosa
- Tiago Alexsander
- Dhavi Pinheiro
- Lucas Antunes

Future A.I é uma plataforma web para análise de crédito, simulação de empréstimos e geração de propostas personalizadas.  
O sistema é dividido em duas partes:

- **Frontend (HTML, CSS, JS):** interface visual para cadastro, login, análise e propostas.
- **Backend (Node.js + Express + MySQL):** API responsável por autenticação, cálculos e persistência dos dados.

---

## 🚀 Funcionalidades Principais

### 👤 Cadastro e Login
- Cadastro de usuários com ID gerado via função SQL.
- Senhas protegidas via *trigger* utilizando SHA2(256).
- Login com validação direta no banco.

### 💰 Análise de Crédito
- Cálculo automático de:
  - Viabilidade com base na renda × dívidas.
  - Juros base por score.
  - Ajustes de juros considerando histórico em outros bancos.
  - Valor total + parcelas.

- Campos dinâmicos: ao selecionar **"Possui conta em outros bancos?"**, novas perguntas surgem.

### 📄 Propostas
- Cada análise gera uma proposta armazenada no banco.
- O usuário é redirecionado para a tela de propostas após o cálculo.

### 🛢️ Integração com MySQL
- Uso de UUID via função `gera_id_dados_criticos()`.
- Tabelas para usuários, pessoas físicas, propostas e empréstimos.
- Salvamento estruturado e seguro.

---

## 📁 Estrutura do Projeto
├── backend-api/
│ ├── server.js
│ ├── db.js
│ ├── .env
│ └── package.json
│
├── index.html
├── analise.html
├── propostas.html
├── resultado.html
├── script.js
├── analise.js
├── style.css
└── README.md

## 🛠️ Tecnologias Utilizadas

### **Frontend**
- HTML5  
- CSS3  
- JavaScript puro (ES6)  

### **Backend**
- Node.js  
- Express  
- MySQL2 (conexão com BD)  
- Arquitetura REST  

### **Banco de Dados**
- MySQL 8  
- Funções, triggers e UUID  
- Tabelas normalizadas para:
  - USUARIO  
  - PESSOA_FISICA  
  - PROPOSTA  
  - EMPRESTIMO_CLIENTE  


▶️ Como Rodar o Backend

1. Entre na pasta backend
cd backend-api

2. Instale as dependências
npm install

3. Configure o banco de dados em db.js
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=suasenha
DB_DATABASE=future_ai
PORT=3000

4. Rode o servidor
node server.js

Se tudo estiver correto:

Servidor rodando em http://localhost:3000


🌐 Endpoints da API

🔹 POST /api/usuarios — cadastro
Body:
{
  "nomeCompleto": "...",
  "email": "...",
  "cpf": "...",
  "dia": 10,
  "mes": 2,
  "ano": 2000,
  "senha": "123456"
}

🔹 POST /api/login
Body:
{
  "email": "...",
  "senha": "..."
}

🔹 POST /api/analise/proposta
Salva a análise da tela de formulário.
Body:
{
  "idUsuario": "...",
  "valorEmprestimo": 10000,
  "duracaoMeses": 24,
  "finalidade": "Reforma",
  "rendaMensal": 3500,
  "dividasTotais": 500,
  "possuiOutrosBancos": true,
  "jaContratouEmprestimo": true,
  "parcelasEmDia": true,
  "proposta": {
    "parcela": 550,
    "total": 13200,
    "jurosPercentual": 1.5
  }
}