const express = require('express');
const mustacheExpress = require('mustache-express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Arquivos estáticos (CSS, imagens)
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para ler dados do formulário
app.use(bodyParser.urlencoded({ extended: false }));

// Sessões para autenticação
app.use(session({
  secret: 'agenda_super_segura',
  resave: false,
  saveUninitialized: false
}));

// Motor de templates Mustache
app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));

// Rotas da aplicação
const authRoutes = require('./routes/auth');
const contatosRoutes = require('./routes/contatos');

app.use('/', authRoutes);
app.use('/contatos', contatosRoutes);

// Redireciona rota raiz para login
app.get('/', (req, res) => {
  res.redirect('/login');
});

// Inicia o servidor
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});