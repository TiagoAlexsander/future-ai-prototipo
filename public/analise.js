/*********************************
 * UPLOAD DE ARQUIVO (seu código)
 *********************************/
function expandirUpload() {
  const btn = document.getElementById('btnArquivo');
  const area = document.getElementById('areaUpload');
  if (!btn || !area) return;

  btn.style.visibility = 'hidden';
  btn.style.opacity = '0';
  btn.style.pointerEvents = 'none';

  setTimeout(() => {
    area.classList.remove('collapsible');
    const alturaReal = area.scrollHeight;
    area.classList.add('collapsible');
    area.offsetHeight;
    area.classList.add('is-open');
    area.style.maxHeight = alturaReal + 'px';

    const onOpenEnd = (e) => {
      if (e.propertyName !== 'max-height') return;
      area.style.maxHeight = 'none';
      area.removeEventListener('transitionend', onOpenEnd);
    };
    area.addEventListener('transitionend', onOpenEnd);
  }, 200);
}

function fecharUpload() {
  const btn = document.getElementById('btnArquivo');
  const area = document.getElementById('areaUpload');
  if (!btn || !area) return;

  area.style.maxHeight = area.scrollHeight + 'px';
  requestAnimationFrame(() => {
    area.style.transition = 'max-height 600ms ease-in-out, opacity 400ms ease-in-out';
    area.style.maxHeight = '0px';
    area.style.opacity = '0';
    area.classList.remove('is-open');
  });

  const onCloseEnd = (e) => {
    if (e.propertyName !== 'max-height') return;
    area.style.maxHeight = '';
    area.style.opacity = '';
    area.style.transition = '';
    area.removeEventListener('transitionend', onCloseEnd);

    btn.style.visibility = 'visible';
    btn.style.opacity = '1';
    btn.style.pointerEvents = 'auto';
  };
  area.addEventListener('transitionend', onCloseEnd);
}

function limparArquivo() {
  const input = document.getElementById('fileInput');
  const nameEl = document.getElementById('fileName');
  const clearBtn = document.getElementById('btnLimparArquivo');
  if (input) input.value = '';
  if (nameEl) {
    nameEl.textContent = '';
    nameEl.style.display = 'none';
  }
  if (clearBtn) clearBtn.disabled = true;
}

function initUploadArea() {
  const input = document.getElementById('fileInput');
  if (!input) return;

  const nameEl = document.getElementById('fileName');
  const clearBtn = document.getElementById('btnLimparArquivo');
  const uploadBox = document.querySelector('.upload-box');

  input.addEventListener('change', (e) => {
    const files = e.target.files || [];
    const fileName = files[0]?.name || '';
    if (fileName) {
      if (nameEl) {
        nameEl.textContent = `Arquivo selecionado: ${fileName}`;
        nameEl.style.display = 'block';
      }
      if (clearBtn) clearBtn.disabled = false;
    } else {
      limparArquivo();
    }
  });

  if (uploadBox) {
    uploadBox.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadBox.style.borderColor = 'var(--button-bg)';
    });
    uploadBox.addEventListener('dragleave', () => {
      uploadBox.style.borderColor = '#ddd';
    });
    uploadBox.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadBox.style.borderColor = '#ddd';
      const files = e.dataTransfer?.files;
      if (files && files.length > 0) {
        try {
          const dt = new DataTransfer();
          dt.items.add(files[0]);
          input.files = dt.files;
          input.dispatchEvent(new Event('change', { bubbles: true }));
        } catch {
          if (nameEl) {
            nameEl.textContent = `Arquivo selecionado: ${files[0].name}`;
            nameEl.style.display = 'block';
          }
          if (clearBtn) clearBtn.disabled = false;
        }
      }
    });
  }

  window.addEventListener('dragover', (e) => e.preventDefault());
  window.addEventListener('drop', (e) => e.preventDefault());
}

/*********************************
 * ALGORITMO DE ANÁLISE
 *********************************/
let valorParcela = 0;
let juros = 0;
let usuarioViavel = null;

function calcularJurosBase(score) {
  if (score < 500) {
    juros = 3;
  } else if (score >= 500 && score < 600) {
    juros = 2;
  } else if (score >= 600) {
    juros = 1;
  }
}

function outrosBancosJuros(outrosEmprestimos, parcelasEmDia) {
  juros += outrosEmprestimos ? (parcelasEmDia ? 0.3 : 0.5) : 0;
}

function calcularValorParcela(emprestimoPedido, duracaoEmprestimo) {
  const jurosTotal = juros / 100;
  valorParcela = (emprestimoPedido * (1 + jurosTotal * duracaoEmprestimo)) / duracaoEmprestimo;
}

function calcularDividaExistente(dividaExistente, prazoDividaExistente, rendaMensal) {
  if (!prazoDividaExistente) return 0;
  let i = dividaExistente / prazoDividaExistente;
  return (i / rendaMensal) * 100;
}

function verificarViabilidade(dividaExistente, prazoDividaExistente, rendaMensal) {
  if (calcularDividaExistente(dividaExistente, prazoDividaExistente, rendaMensal) >= 50) {
    usuarioViavel = false;
  } else {
    usuarioViavel = true;
  }
}

/*********************************
 * CAMPOS "OUTROS BANCOS"
 *********************************/
function initCampos7() {
  const contaOutrosSim = document.getElementById("contaOutrosSim");
  const contaOutrosNao = document.getElementById("contaOutrosNao");
  const grupo7extra   = document.getElementById("grupo7extra");

  const jaEmprestimoSim = document.getElementById("jaEmprestimoSim");
  const jaEmprestimoNao = document.getElementById("jaEmprestimoNao");
  const dividasTotais   = document.getElementById("dividasTotais");
  const parcelasDiaSim  = document.getElementById("parcelasDiaSim");
  const parcelasDiaNao  = document.getElementById("parcelasDiaNao");

  if (!contaOutrosSim || !contaOutrosNao || !grupo7extra) {
    console.warn("Campos de 'outros bancos' não encontrados.");
    return;
  }

  function setObrigatoriosAtivos(ativo) {
    const campos = [jaEmprestimoSim, jaEmprestimoNao, dividasTotais, parcelasDiaSim, parcelasDiaNao];

    campos.forEach((el) => {
      if (!el) return;

      el.required = ativo;   // coloca required só quando o grupo extra estiver visível

      if (!ativo) {
        if (el.type === "radio") el.checked = false;
        else el.value = "";
      }

      // Desabilitado quando não estiver ativo
      if (el.id === "dividasTotais") el.disabled = !ativo;
      if (el.id === "parcelasDiaSim") el.disabled = !ativo;
      if (el.id === "parcelasDiaNao") el.disabled = !ativo;
    });
  }

  function mostrarExtra(mostrar) {
    if (mostrar) {
      grupo7extra.style.display = "block";
      setObrigatoriosAtivos(true);
    } else {
      grupo7extra.style.display = "none";
      setObrigatoriosAtivos(false);
    }
  }

  contaOutrosSim.addEventListener("change", () => mostrarExtra(true));
  contaOutrosNao.addEventListener("change", () => mostrarExtra(false));

  // Estado inicial ao carregar a página
  mostrarExtra(contaOutrosSim.checked);
}

/*********************************
 * FORMULÁRIO DE ANÁLISE
 *********************************/
function initFormAnalise() {
  const form = document.getElementById("formDadosSolicitante");
  if (!form) {
    console.error('Formulário "formDadosSolicitante" não encontrado.');
    return;
  }

  console.log("Formulário de análise encontrado, registrando submit...");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("Submit de análise disparado.");

    const emprestimoPedido = Number(document.getElementById("valorEmprestimo")?.value || 0);
    const duracaoEmprestimo = Number(document.getElementById("duracaoMeses")?.value || 0);
    const rendaMensal = Number(document.getElementById("rendaMensal")?.value || 0);
    const dividaExistente = Number(document.getElementById("dividasTotais")?.value || 0);

    const finalidade = document.getElementById("finalidade")?.value || "";

    const outrosEmprestimos = !!document.getElementById("jaEmprestimoSim")?.checked;
    const parcelasEmDia = !!document.getElementById("parcelasDiaSim")?.checked;
    const possuiOutrosBancos = !!document.getElementById("contaOutrosSim")?.checked;

    const scoreInput = document.getElementById("score");
    const score = scoreInput ? Number(scoreInput.value || 0) : 600;

    // 1) Lógica de negócio
    verificarViabilidade(dividaExistente, duracaoEmprestimo, rendaMensal);
    if (!usuarioViavel) {
      alert("Usuário inviável para crédito (renda comprometida acima de 50%).");
      return;
    }

    juros = 0;
    calcularJurosBase(score);
    if (outrosEmprestimos) {
      outrosBancosJuros(outrosEmprestimos, parcelasEmDia);
    }
    calcularValorParcela(emprestimoPedido, duracaoEmprestimo);

    const totalAPagar = valorParcela * duracaoEmprestimo;

    const propostaBase = {
      valor: emprestimoPedido,
      meses: duracaoEmprestimo,
      parcela: valorParcela.toFixed(2),
      total: totalAPagar.toFixed(2),
      jurosPercentual: juros
    };

    localStorage.setItem("propostaBase", JSON.stringify(propostaBase));

    // 2) Envio pro backend
    const usuarioStr = localStorage.getItem("usuarioLogado");
    if (!usuarioStr) {
      alert("Sessão expirada. Faça login novamente.");
      window.location.href = "index.html";
      return;
    }

    let idUsuario = null;
    try {
      const usuario = JSON.parse(usuarioStr);
      idUsuario = usuario.ID_USUARIO || usuario.idUsuario;
    } catch (e) {
      console.error("Erro parse usuarioLogado:", e);
    }

    if (!idUsuario) {
      alert("Não foi possível identificar o usuário. Faça login novamente.");
      window.location.href = "index.html";
      return;
    }

    try {
      console.log("Enviando análise para backend em:", `http://localhost:3000/api/analise/proposta`);
      const resp = await fetch('http://localhost:3000/api/analise/proposta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idUsuario,
          valorEmprestimo: emprestimoPedido,
          duracaoMeses: duracaoEmprestimo,
          finalidade,
          rendaMensal,
          dividasTotais: dividaExistente,
          possuiOutrosBancos,
          jaContratouEmprestimo: outrosEmprestimos,
          parcelasEmDia,
          proposta: {
            parcela: valorParcela,
            total: totalAPagar,
            jurosPercentual: juros
          }
        }),
      });

      if (!resp.ok) {
        const erro = await resp.json().catch(() => ({}));
        console.error('Erro API análise/proposta:', erro);
        alert(erro.erro || 'Não foi possível salvar a análise no servidor.');
        return;
      }

      const dados = await resp.json();
      console.log('Proposta salva no servidor:', dados);

      window.location.href = "propostas.html";
    } catch (err) {
      console.error('Falha ao comunicar com backend:', err);
      alert('Falha ao comunicar com o servidor.');
    }
  });
}

/*********************************
 * INICIALIZAÇÃO DA PÁGINA
 *********************************/
function initAnalisePage() {
  // Verifica se tem usuário logado
  const usuarioStr = localStorage.getItem('usuarioLogado');
  if (!usuarioStr) {
    alert('Faça login para acessar a análise.');
    window.location.href = 'index.html';
    return;
  }

  try {
    const usuario = JSON.parse(usuarioStr);

    const nomeInput = document.getElementById('nomeCompleto');
    const cpfInput = document.getElementById('cpf');
    const emailContato = document.getElementById('emailContato');

    if (nomeInput && usuario.NOME_COMPLETO) {
      nomeInput.value = usuario.NOME_COMPLETO;
    }
    if (cpfInput && (usuario.CPF || usuario.cpf)) {
      cpfInput.value = usuario.CPF || usuario.cpf;
    }
    if (emailContato && usuario.EMAIL) {
      emailContato.value = usuario.EMAIL;
    }
  } catch (e) {
    console.error('Erro ao ler usuarioLogado:', e);
  }

  initCampos7();
  initFormAnalise();
  initUploadArea();
}

document.addEventListener("DOMContentLoaded", initAnalisePage);
