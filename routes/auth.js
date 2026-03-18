const express = require('express');
const router = express.Router();
const db = require('../database/db');

// Tela de login
router.get('/login', (req, res) => {
  res.render('login');
});

// Tela de cadastro
router.get('/register', (req, res) => {
  res.render('register');
});

// Cadastro de novo usuário
router.post('/register', (req, res) => {
  const { nome, email, senha } = req.body;

  // Verifica se o usuário já existe
  db.get('SELECT * FROM usuarios WHERE email = ?', [email], (err, row) => {
    if (row) {
      return res.render('register', { erro: 'Usuário já existe' });
    }

    // Insere novo usuário
    db.run(
      'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)',
      [nome, email, senha],
      (err) => {
        if (err) {
          return res.send('Erro ao cadastrar usuário.');
        }
        res.redirect('/login');
      }
    );
  });
});

// Login
router.post('/login', (req, res) => {
  const { email, senha } = req.body;

  db.get(
    'SELECT * FROM usuarios WHERE email = ? AND senha = ?',
    [email, senha],
    (err, user) => {
      if (!user) {
        return res.render('login', { erro: 'Email ou senha inválidos' });
      }

      // Salva usuário na sessão
      req.session.user = user;
      res.redirect('/contatos');
    }
  );
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

module.exports = router;