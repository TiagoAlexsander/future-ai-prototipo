// Carrega usuários já salvos no localStorage ou inicia vazio
let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
let logado = false;
const API_BASE_URL = 'http://localhost:3000/api'; // back-end Node


/* ===== Navegação de Login/Cadastro ===== */
function mudarTelaCadastro() {
  const login = document.getElementById("loginBox");
  const cad = document.getElementById("cadastroTela");
  if (login && cad) {
    login.classList.add("hidden");
    cad.classList.remove("hidden");
  }
}

function cancelarCadastro() {
  const login = document.getElementById("loginBox");
  const cad = document.getElementById("cadastroTela");
  if (login && cad) {
    login.classList.remove("hidden");
    cad.classList.add("hidden");
  }
}

/* ===== Cadastro de Usuário ===== */


async function cadastrarUsuario(event) {
  if (event) event.preventDefault();

  const nome = document.getElementById("nome")?.value?.trim() || "";
  const email = document.getElementById("emailCadastro")?.value?.trim() || "";
  const cpf = document.getElementById("cpf")?.value?.replace(/\D/g, "") || "";
  const senha = document.getElementById("senhaCadastro")?.value || "";
  const confirma = document.getElementById("confirma")?.value || "";
  const dia = document.getElementById("dia")?.value || "";
  const mes = document.getElementById("mes")?.value || "";
  const ano = document.getElementById("ano")?.value || "";

  if (!nome || !email || !cpf || !senha || !confirma || !dia || !mes || !ano) {
    return alert("Preencha todos os campos.");
  }
  if (senha !== confirma) return alert("As senhas não coincidem!");
  if (senha.length < 6) return alert("A senha deve ter no mínimo 6 caracteres.");

  try {
    const resp = await fetch(`${API_BASE_URL}/usuarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nomeCompleto: nome,
        email,
        cpf,
        dia,
        mes,
        ano,
        senha,
      }),
    });

    if (!resp.ok) {
      const erro = await resp.json().catch(() => ({}));
      return alert(erro.erro || 'Erro ao cadastrar usuário.');
    }

    const dados = await resp.json();
    alert("Usuário cadastrado com sucesso!");

    // Se quiser já salvar o usuário cadastrado no localStorage:
    localStorage.setItem("usuarioLogado", JSON.stringify(dados.usuario));

    cancelarCadastro(); // volta para tela de login
  } catch (e) {
    console.error(e);
    alert("Erro de comunicação com o servidor.");
  }
}

/* ===== Login ===== */
async function verificarLogin() {
  const email = document.getElementById("emailLogin")?.value?.trim() || "";
  const senha = document.getElementById("senhaLogin")?.value || "";

  if (!email || !senha) {
    return alert("Preencha email e senha.");
  }

  try {
    const resp = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha }),
    });

    const dados = await resp.json();

    if (!resp.ok) {
      return alert(dados.erro || 'Email ou senha incorretos!');
    }

    // Salva usuário logado no localStorage (para proteger páginas internas)
    localStorage.setItem("usuarioLogado", JSON.stringify(dados.usuario));

    // Redireciona para tela interna (você já usa analise.html)
    window.location.href = "analise.html";
  } catch (e) {
    console.error(e);
    alert("Erro de comunicação com o servidor.");
  }
}

/* ===== Proteger páginas internas ===== */
function protegerPagina() {
  const usuarioLogado = localStorage.getItem("usuarioLogado");
  if (!usuarioLogado) window.location.href = 'index.html';
}

/* ===== Logout ===== */
function sair() {
  localStorage.removeItem("usuarioLogado");
  window.location.href = 'index.html';
}