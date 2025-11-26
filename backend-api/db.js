const mysql = require('mysql2/promise');

// LEMBRA DE USAR O SEU AI, VICTOR ESTA USANDO A DELE AQUI

const pool = mysql.createPool({
  host: 'localhost',       // seu MySQL local
  user: 'root',            // usuário do MySQL
  password: 'Yg76211234!',      // senha do MySQL 
  database: 'future_ai',   // nome do banco 
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;
