require('dotenv').config();
const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT ? process.env.PORT : 8080;
const routes = require('./routes');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(routes);
app.listen(PORT, () => {
    console.log(`server running on PORT ${PORT}`);
});

module.exports = app;