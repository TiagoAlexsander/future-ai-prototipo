let usuarios = [];
let logado = false;

function mudarTelaCadastro() {
  document.getElementById("loginBox").classList.add("hidden");
  document.getElementById("cadastroTela").classList.remove("hidden");
}

function cancelarCadastro() {
  document.getElementById("loginBox").classList.remove("hidden");
  document.getElementById("cadastroTela").classList.add("hidden");
}

function cadastrarUsuario(event) {
  event.preventDefault();

  const nome = document.getElementById("nome").value;
  const email = document.getElementById("emailCadastro").value;
  const cpf = document.getElementById("cpf").value;
  const senha = document.getElementById("senhaCadastro").value;
  const confirma = document.getElementById("confirma").value;
  const dia = document.getElementById("dia").value;
  const mes = document.getElementById("mes").value;
  const ano = document.getElementById("ano").value;

  if (senha !== confirma) {
    alert("Senhas diferentes");
    return;
  }

  if (usuarios.find(u => u.email === email)) {
    alert("Email já cadastrado");
    return;
  }

  if (usuarios.find(u => u.cpf === cpf)) {
    alert("CPF já cadastrado");
    return;
  }

  const usuario = {
    nome,
    email,
    cpf,
    dataNascimento: { dia, mes, ano },
    senha
  };

  usuarios.push(usuario);

  alert("Usuário cadastrado com sucesso!");
  cancelarCadastro();
}

function verificarLogin() {
  const email = document.getElementById("emailLogin").value;
  const senha = document.getElementById("senhaLogin").value;
  const usuarioEncontrado = usuarios.find(u => u.email === email && u.senha === senha);

  if (usuarioEncontrado) {
    logado = true;
    alert("login realizado com sucesso");
    window.location.href = "analise.html";
  } else {
    alert("Acesso negado");
  }
}

// Proteção de páginas internas
function protegerPagina() {
  if (!logado) {
    window.location.href = "login.html";
  }
}