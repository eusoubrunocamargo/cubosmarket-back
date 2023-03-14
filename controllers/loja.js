const knex = require('../config/db');

const addLoja = async (req, res) => {
    
    const { nome, usuario_id } = req.body;

    console.log({
        nome,
        usuario_id,
    })

    if (!nome) {
        return res
            .status(400)
            .json({
                mensagem: "O nome da loja é obrigatório!"
            });
    };

    try {

        const [loja] = await knex
            .insert({ nome, usuario_id })
            .into("lojas")
            .returning("nome");

        console.log(loja);

        await knex("usuario").where("id", usuario_id).update({ loja_cadastrada: true });

        return res.status(201).json({
            mensagem: `${loja.nome} cadastrada com sucesso`,
            marketname: loja.nome,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            mensagem: "Erro ao cadastrar a loja",
        });
    };
};

module.exports = {
    addLoja,
};