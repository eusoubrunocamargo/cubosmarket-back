const express = require('express');

//middleware
const verify = require('./middleware/verify');

//controladores
const { exibirVitrine } = require("./controllers/vitrine");
const { fazerCadastro, fazerLogin} = require("./controllers/usuario");
const { addLoja } = require('./controllers/loja');
const { listarProdutos , deletarProduto , adicionarProduto} = require('./controllers/produtos');
const { upload } = require('./controllers/fileUpload');

//rotas públicas
const routes = express();
routes.get("/", exibirVitrine);
routes.post("/login", fazerLogin);
routes.post("/cadastro", fazerCadastro);

//rotas protegidas
routes.use(verify);
routes.post("/loja", addLoja);
routes.post("/produtos", adicionarProduto);
routes.get("/produtos", listarProdutos)
routes.delete("/produtos/:id", deletarProduto);
routes.post("/upload", upload);

module.exports = routes;
