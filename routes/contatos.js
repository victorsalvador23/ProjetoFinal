const express = require('express');
const router = express.Router();
const db = require('../database/db');

const requireLogin = (req, res, next) => {
  if (!req.session.user) return res.redirect('/login');
  next();
};

router.get('/', requireLogin, (req, res) => {
  db.all('SELECT * FROM contatos WHERE emailUsuario = ?', [req.session.user.email], (err, rows) => {
    res.render('contatos_list', { contatos: rows });
  });
});

router.get('/novo', requireLogin, (req, res) => {
  res.render('contato_form', { contato: {} });
});

router.post('/novo', requireLogin, (req, res) => {
  const { nome, telefone, emailContato } = req.body;
  db.run('INSERT INTO contatos (nome, telefone, emailContato, emailUsuario) VALUES (?, ?, ?, ?)',
    [nome, telefone, emailContato, req.session.user.email], (err) => {
      res.redirect('/contatos');
    });
});

router.get('/editar/:id', requireLogin, (req, res) => {
  db.get('SELECT * FROM contatos WHERE id = ? AND emailUsuario = ?', [req.params.id, req.session.user.email], (err, contato) => {
    if (!contato) return res.send('Não autorizado');
    res.render('contato_form', { contato });
  });
});

router.post('/editar/:id', requireLogin, (req, res) => {
  const { nome, telefone, emailContato } = req.body;
  db.run('UPDATE contatos SET nome = ?, telefone = ?, emailContato = ? WHERE id = ? AND emailUsuario = ?',
    [nome, telefone, emailContato, req.params.id, req.session.user.email], (err) => {
      res.redirect('/contatos');
    });
});

router.post('/excluir/:id', requireLogin, (req, res) => {
  db.run('DELETE FROM contatos WHERE id = ? AND emailUsuario = ?', [req.params.id, req.session.user.email], (err) => {
    res.redirect('/contatos');
  });
});

module.exports = router;