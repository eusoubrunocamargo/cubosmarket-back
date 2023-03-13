const express = require('express');
const { exibirVitrine } = require("./controllers/vitrine");
const {fazerCadastro, fazerLogin} = require("./controllers/usuario");
const routes = express();



routes.get("/", exibirVitrine);
routes.post("/login", fazerLogin);
routes.post("/cadastro", fazerCadastro);

module.exports = routes;
