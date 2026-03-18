const sqlite3 = require('sqlite3').verbose();

// Cria ou abre o arquivo agenda.db na pasta database/
const db = new sqlite3.Database('./database/agenda.db');

// Criação automática das tabelas, caso não existam
db.serialize(() => {
  // Tabela de usuários
  db.run(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      senha TEXT NOT NULL
    )
  `);

  // Tabela de contatos
  db.run(`
    CREATE TABLE IF NOT EXISTS contatos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      telefone TEXT NOT NULL,
      emailContato TEXT NOT NULL,
      emailUsuario TEXT NOT NULL
    )
  `);
});

module.exports = db;