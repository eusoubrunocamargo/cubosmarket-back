const knex = require('../config/db');

const exibirVitrine = async (req,res) => {
try {

    const produtos = await knex.select().from('produtos');
    // res.json(produtos);

    console.log(produtos);

    res.json(produtos);

} catch (error) {

    console.error(error.message);
    
    res.status(500).json({
        mensagem: "Erro ao listar produtos"
    });

};
};

module.exports = {
    exibirVitrine,
}