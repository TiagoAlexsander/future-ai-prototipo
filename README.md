# Future A.I - Protótipo

Este é um protótipo de aplicação web para análise de crédito e propostas financeiras utilizando inteligência artificial.

## 📋 Sobre o Projeto

O Future A.I é uma aplicação web que simula um sistema de análise de crédito com funcionalidades de:
- Login e cadastro de usuários
- Análise de dados financeiros
- Visualização de propostas de crédito
- Geração de insights e recomendações

## 🚀 Como Executar

Este é um projeto de frontend estático (HTML, CSS e JavaScript puro), sem necessidade de build ou dependências externas.

### Opção 1: Abrir diretamente no navegador
1. Clone o repositório:
   ```bash
   git clone https://github.com/TiagoAlexsander/future-ai-prototipo.git
   cd future-ai-prototipo
   ```

2. Abra o arquivo `index.html` diretamente no seu navegador

### Opção 2: Usar um servidor local
Para evitar problemas com CORS e ter uma melhor experiência de desenvolvimento:

**Com Python:**
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

**Com Node.js (http-server):**
```bash
npx http-server -p 8000
```

**Com VS Code Live Server:**
1. Instale a extensão "Live Server" no VS Code
2. Clique com botão direito no arquivo `index.html`
3. Selecione "Open with Live Server"

Depois acesse: `http://localhost:8000`

## 💻 Desenvolvimento com VS Code

### GitHub Copilot

**Sim, o projeto funciona completamente com o GitHub Copilot no VS Code!**

Se você tem a extensão GitHub Copilot instalada no VS Code, ela funcionará normalmente para:
- ✅ Sugestões de código JavaScript
- ✅ Autocompletar HTML e CSS
- ✅ Geração de funções e lógica
- ✅ Documentação e comentários
- ✅ Refatoração de código

O Copilot é uma ferramenta de assistência ao desenvolvimento que funciona independentemente do tipo de projeto. Como este é um projeto HTML/CSS/JavaScript puro, o Copilot oferece sugestões completas e contextualizadas.

### Extensões Recomendadas para VS Code

Para melhor experiência de desenvolvimento, recomendamos:

- **Live Server** - Para executar um servidor local com hot reload
- **GitHub Copilot** - Assistente de código com IA (requer licença)
- **Prettier** - Formatação de código
- **ESLint** - Análise de código JavaScript
- **HTML CSS Support** - Autocompletar e validação HTML/CSS

## 📁 Estrutura do Projeto

```
future-ai-prototipo/
├── index.html         # Página de login e cadastro
├── analise.html       # Página de análise de dados
├── propostas.html     # Página de propostas de crédito
├── resultado.html     # Página de resultados e insights
├── script.js          # Lógica JavaScript (login, cadastro)
├── style.css          # Estilos globais da aplicação
└── README.md          # Esta documentação
```

## 🔧 Funcionalidades

### 1. Sistema de Login e Cadastro (index.html)
- Cadastro de novos usuários com validação
- Login com email e senha
- Validação de CPF único
- Verificação de senhas

### 2. Análise de Dados (analise.html)
- Área para visualização de dados
- Comparação de arquivos
- Acesso a recomendações

### 3. Propostas de Crédito (propostas.html)
- Visualização de múltiplas propostas
- Seleção interativa de proposta
- Aceite de termos e condições
- Contratação de proposta

### 4. Resultados e Insights (resultado.html)
- Insights baseados em dados
- Recomendações de melhoria
- Sugestões de otimização

## 🎨 Tecnologias Utilizadas

- **HTML5** - Estrutura das páginas
- **CSS3** - Estilização e layout responsivo
- **JavaScript (Vanilla)** - Lógica e interatividade
- **Sem frameworks** - Código puro e leve

## 📝 Notas de Desenvolvimento

- O sistema de login atualmente armazena dados apenas em memória (array JavaScript)
- Para produção, seria necessário implementar um backend com banco de dados
- A proteção de páginas (`protegerPagina()`) não persiste entre recarregamentos
- As propostas de crédito são estáticas e exemplificativas

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

Este é um projeto protótipo educacional.

## ✨ Autor

Desenvolvido como protótipo do Future A.I
