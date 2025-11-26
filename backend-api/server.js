// server.js
const express = require('express');
const cors = require('cors');
const pool = require('./db');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// ROTA PADRÃO

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// CADASTRO
app.post('/api/usuarios', async (req, res) => {
  const { nomeCompleto, email, cpf, dia, mes, ano, senha } = req.body;

  if (!nomeCompleto || !email || !cpf || !dia || !mes || !ano || !senha) {
    return res.status(400).json({ erro: 'Preencha todos os campos.' });
  }

  const diaStr = String(dia).padStart(2, '0');
  const mesStr = String(mes).padStart(2, '0');
  const dataNascimento = `${ano}-${mesStr}-${diaStr}`;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [usuariosEmail] = await conn.query(
      'SELECT 1 FROM USUARIO WHERE EMAIL = ?',
      [email]
    );
    if (usuariosEmail.length > 0) {
      await conn.rollback();
      return res.status(409).json({ erro: 'Email já cadastrado.' });
    }

    const [usuariosCpf] = await conn.query(
      'SELECT 1 FROM PESSOA_FISICA WHERE CPF = ?',
      [cpf]
    );
    if (usuariosCpf.length > 0) {
      await conn.rollback();
      return res.status(409).json({ erro: 'CPF já cadastrado.' });
    }

    const [idResult] = await conn.query(
      'SELECT gera_id_dados_criticos() AS id'
    );
    const idUsuario = idResult[0].id;

    await conn.query(
      `INSERT INTO USUARIO 
       (ID_USUARIO, NOME_COMPLETO, EMAIL, DATA_NASCIMENTO, SENHA)
       VALUES (?, ?, ?, ?, ?)`,
      [idUsuario, nomeCompleto, email, dataNascimento, senha]
    );

    await conn.query(
      `INSERT INTO PESSOA_FISICA
       (ID_USUARIO, SALARIO, CPF, CONTA_ATIVA, EMPRESTIMO_REALIZADO, DIVIDA_ATUAL, ATRASO)
       VALUES (?, NULL, ?, 1, 0, NULL, 0)`,
      [idUsuario, cpf]
    );

    await conn.commit();

    return res.status(201).json({
      mensagem: 'Usuário cadastrado com sucesso.',
      usuario: {
        idUsuario,
        nomeCompleto,
        email,
        dataNascimento,
        cpf,
      },
    });
  } catch (err) {
    console.error('Erro no cadastro:', err);
    await conn.rollback();
    return res.status(500).json({ erro: 'Erro interno no servidor.' });
  } finally {
    conn.release();
  }
});

// LOGIN
app.post('/api/login', async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: 'Informe email e senha.' });
  }

  try {
    const [rows] = await pool.query(
      `SELECT ID_USUARIO, NOME_COMPLETO, EMAIL, DATA_NASCIMENTO
         FROM USUARIO
        WHERE EMAIL = ? 
          AND SENHA = SHA2(?, 256)`,
      [email, senha]
    );

    if (rows.length === 0) {
      return res.status(401).json({ erro: 'Email ou senha inválidos.' });
    }

    const usuario = rows[0];

    return res.json({
      mensagem: 'Login realizado com sucesso.',
      usuario,
    });
  } catch (err) {
    console.error('Erro no login:', err);
    return res.status(500).json({ erro: 'Erro interno no servidor.' });
  }
});

// TESTE
app.get('/api/ping', (req, res) => {
  res.json({ ok: true, mensagem: 'API Future A.I funcionando 🙂' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

// ================================
//  ROTA PARA SALVAR ANÁLISE / PROPOSTA
// ================================
// body esperado:
// {
//   idUsuario,
//   valorEmprestimo,
//   duracaoMeses,
//   finalidade,
//   rendaMensal,
//   dividasTotais,
//   possuiOutrosBancos,
//   jaContratouEmprestimo,
//   parcelasEmDia,
//   proposta: { parcela, total, jurosPercentual }
// }

app.post('/api/analise/proposta', async (req, res) => {
  const {
    idUsuario,
    valorEmprestimo,
    duracaoMeses,
    finalidade,
    rendaMensal,
    dividasTotais,
    possuiOutrosBancos,
    jaContratouEmprestimo,
    parcelasEmDia,
    proposta
  } = req.body;

  if (!idUsuario || !valorEmprestimo || !duracaoMeses) {
    return res.status(400).json({ erro: 'Dados obrigatórios faltando.' });
  }

  let conn;
  try {
    conn = await pool.getConnection();
    await conn.beginTransaction();

    // 1) Garante que o usuário existe
    const [userRows] = await conn.query(
      'SELECT 1 FROM USUARIO WHERE ID_USUARIO = ?',
      [idUsuario]
    );
    if (userRows.length === 0) {
      await conn.rollback();
      return res.status(404).json({ erro: 'Usuário não encontrado.' });
    }

    // 2) Gera ID para EMPRESTIMO_CLIENTE
    const [idResult] = await conn.query(
      'SELECT gera_id_dados_criticos() AS id'
    );
    const idEmpCli = idResult[0].id;

    // 3) Insere em EMPRESTIMO_CLIENTE
    await conn.query(
      `INSERT INTO EMPRESTIMO_CLIENTE
       (ID_EMP_CLI, VALOR_EMPRESTIMO, QNT_PARCELAS, FINALIDADE, ID_USUARIO)
       VALUES (?, ?, ?, ?, ?)`,
      [idEmpCli, valorEmprestimo, duracaoMeses, finalidade || null, idUsuario]
    );

    // 4) Insere em PROPOSTA usando VALOR_TOTAL calculado na análise
    const nomeProposta = 'Proposta Future AI';
    const valorTotal = proposta?.total ?? valorEmprestimo;

    const [propResult] = await conn.query(
      `INSERT INTO PROPOSTA
       (NOME_PROPOSTA, VALOR_TOTAL, QUANTIDADE_PARCELAS)
       VALUES (?, ?, ?)`,
      [nomeProposta, valorTotal, duracaoMeses]
    );

    const idProposta = propResult.insertId;

    await conn.commit();

    return res.status(201).json({
      mensagem: 'Análise e proposta salvas com sucesso.',
      idEmprestimoCliente: idEmpCli,
      idProposta,
    });
  } catch (err) {
    console.error('Erro ao salvar análise/proposta:', err);
    if (conn) await conn.rollback();
    return res.status(500).json({ erro: 'Erro interno no servidor.' });
  } finally {
    if (conn) conn.release();
  }
});
