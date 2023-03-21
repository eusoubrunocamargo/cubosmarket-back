const knex = require('../config/db');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const fazerCadastro = async (req, res) => {

    const { nome, email, senha } = req.body;

    console.log(nome, email, senha);

    if (!nome || !email || !senha) {
        return res
            .status(400)
            .json({
                mensagem: "Todos os campos são obrigatórios"
            });
    };

    try {

        const [emailExiste] = await knex('usuario').select('email').where('email', email);

        if (emailExiste) {
            return res.status(400).json({
                mensagem: 'O e-mail informado já está em uso!'
            });
        };

        const senhaBcrypt = await bcrypt.hash(senha, 10);

        const result = await knex('usuario').insert({ nome, email, senha: senhaBcrypt}).returning('*');

        return res.status(201).json({
            mensagem: "Usuário cadastrado com sucesso, por favor, faça login",
            usuario: result[0],
        });

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            mensagem: "Erro ao cadastrar usuário",
        });
    };
};

const fazerLogin = async (req, res) => {
    
    const { email, senha } = req.body;

    console.log(email,senha);

    if (!email || !senha) {
        return res.status(400).json({ 
            mensagem: "Todos os campos são obrigatórios!"
        });
    }

    try {

        const usuario = await knex('usuario').where({ email }).first();

        if (!usuario || !(await bcrypt.compare(senha, usuario.senha))) {
            return res.status(401).json({
                mensagem: "E-mail ou senha inválidos!"
            });
        }

        console.log("passou aqui");

        console.log(usuario);

        const token = jwt.sign({ id: usuario.id }, 'chave_secreta', { expiresIn: 3600 });
        console.log(token);

        let marketname = "";
        
        if(usuario.loja_cadastrada){
            console.log("tem loja!");
            const loja = await knex('lojas').where('usuario_id', usuario.id).first();
            marketname = loja.nome;
        };

        const { senha: _, ...dataUser } = usuario;
        console.log(marketname);

        return res.json({ ...dataUser, token, marketname, mensagem: "Logado!" });

    } catch (error) {
        return res
            .status(500)
            .json({
                mensagem: "Erro interno do servidor"
            });
    };

};

module.exports = {
    fazerCadastro,
    fazerLogin,
};