const express = require('express');

//middleware
const verify = require('./middleware/verify');

//controladores
const { exibirVitrine } = require("./controllers/vitrine");
const { fazerCadastro, fazerLogin} = require("./controllers/usuario");
const { addLoja } = require('./controllers/loja');
const { listarProdutos , deletarProduto } = require('./controllers/produtos');

//rotas públicas
const routes = express();
routes.get("/", exibirVitrine);
routes.post("/login", fazerLogin);
routes.post("/cadastro", fazerCadastro);

//rotas protegidas
routes.use(verify);
routes.post("/loja", addLoja);
routes.get("/produtos", listarProdutos)
routes.delete("/produtos/:id", deletarProduto);

module.exports = routes;
