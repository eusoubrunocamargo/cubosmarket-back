const knex = require('../config/db');

const adicionarProduto = async (req,res) => {

    const {nome, descricao, preco, estoque, categoria_id, user_id, imagem_url} = req.body;
    
    if(!nome || !preco || !descricao || !estoque || !categoria_id){
        return res.status(400).json({mensagem: "Nome, preço, estoque e categoria são obrigatórios!"});
    };

    try {

        const {id: loja_id} = await knex("lojas")
        .where("usuario_id", user_id)
        .select("id")
        .first();

        const produto = await knex("produtos")
        .insert({
            nome,
            descricao,
            preco,
            estoque,
            categoria_id,
            loja_id,
            imagem_url,
        })
        .returning("*");

        console.log(produto);

        return res.status(201).json({
            mensagem: "Produto cadastrado com sucesso!",
            produto,
        })
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            mensagem: "Erro ao cadastrar produto",
        });
    };
};

const listarProdutos = async (req,res) => {

    try {

        console.log(req.user);

        const {id: user_id} = req.user;

        const produtos = await knex('produtos')
            .join('lojas', 'produtos.loja_id', '=', 'lojas.id')
            .where('lojas.usuario_id', user_id)
            .select('produtos.*');

        // const {id: loja_id} = await knex("lojas")
        // .where("usuario_id", user_id)
        // .select("id")
        // .first();

        // const produtos = await knex("produtos")
        // .select("*")
        // .where({loja_id});

        res.json(produtos);

    } catch (error) {

        console.error(error);

        res.status(500).json({mensagem: "Erro ao listar produtos"});

    };
};

const deletarProduto = async (req,res) => {
    const { id } = req.params;
    
    try {

        await knex('produtos').where({id}).del();
        return res.status(204).send();
        
    } catch (error) {
        
        console.log(error);
        return res.status(500).json({
            mensagem: "Erro ao deletar produto"
        });

    };
    
    }

module.exports = {
    listarProdutos,
    deletarProduto,
    adicionarProduto
};