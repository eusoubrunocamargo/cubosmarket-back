const express = require('express');
const { exibirVitrine } = require("./controllers/vitrine");
const routes = express();
routes.get("/", exibirVitrine);

module.exports = routes;
