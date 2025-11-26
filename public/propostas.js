const container = document.getElementById("propostasContainer");
const btnContratar = document.getElementById("btnContratar");
const chk1 = document.getElementById("chk1");
const chk2 = document.getElementById("chk2");
let propostaSelecionada = null;

// Recupera proposta base do localStorage (ou usa exemplo se não houver nada)
const propostaBase = JSON.parse(localStorage.getItem("propostaBase")) || {
  valor: 1000,
  meses: 12,
  parcela: "104,16",
  total: "1250,00"
};

// Função para gerar as 3 propostas (base, dobro e metade)
function gerarPropostas(base) {
  const valor = Number(base.valor);
  const meses = Number(base.meses);
  const parcela = parseFloat(base.parcela.replace(",", "."));
  const total = base.total; // mantém o mesmo total

  const formatar = (num) => num.toFixed(2).replace(".", ",");

  const propostaBase = {
    valor,
    meses,
    parcela: formatar(parcela),
    total
  };

  const propostaDobro = {
    valor,
    meses: meses * 2,
    parcela: formatar(parcela / 2),
    total
  };

  const propostaMetade = {
    valor,
    meses: Math.floor(meses / 2),
    parcela: formatar(parcela * 2),
    total
  };

  // Retorna na ordem: maior prazo, base, menor prazo
  return [propostaDobro, propostaBase, propostaMetade];
}

function criarProposta({ valor, meses, parcela, total }, index) {
  const card = document.createElement("div");
  card.classList.add("proposta");
  card.setAttribute("data-select", index + 1);

  card.innerHTML = `
    <p><strong>Proposta ${index + 1}</strong></p>
    <p>R$ ${valor},00 em ${meses}x R$ ${parcela}</p>
    <p><strong>Total:</strong> R$ ${total}</p>
  `;

  card.addEventListener("click", () => {
    document.querySelectorAll(".proposta").forEach(c => c.classList.remove("selecionada"));
    card.classList.add("selecionada");
    propostaSelecionada = card.getAttribute("data-select");
    atualizarBotao();
  });

  return card;
}

function atualizarBotao() {
  if (propostaSelecionada && chk1.checked && chk2.checked) {
    btnContratar.disabled = false;
  } else {
    btnContratar.disabled = true;
  }
}

// Renderiza as propostas
const propostasCalculadas = gerarPropostas(propostaBase);
propostasCalculadas.forEach((dados, i) => {
  const proposta = criarProposta(dados, i);
  container.appendChild(proposta);
});

chk1.addEventListener("change", atualizarBotao);
chk2.addEventListener("change", atualizarBotao);

document.getElementById("formProposta").addEventListener("submit", (e) => {
  if (btnContratar.disabled) {
    e.preventDefault();
    alert("Selecione uma proposta e aceite os termos antes de contratar.");
  } else {
    alert("Proposta contratada com sucesso!");
  }
});