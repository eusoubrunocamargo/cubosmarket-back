const jwt = require("jsonwebtoken");

const verify = (req,res,next) => {

    const authHeader = req.headers.authorization;

    if(!authHeader){
        return res.status(401).json({
            mensagem: "Token não enviado"
        });
    };

    const token_arr = authHeader.split(" ");
    const token = token_arr[1];

    if(!token){
        return res.status(401).json({mensagem: "Token não enviado"});
    };

    try {
        console.log("entrou no jwt verify");
        const payload = jwt.verify(token, 'chave_secreta');
        req.user = payload;
        next();
    } catch (error) {
        return res.status(403).send({
            mensagem: 'Token inválido'
        });
    }

    // jwt.verify(token, 'chave_secreta', (err,payload)=> {
        
    //     if(err){
    //         console.log(err);
    //         return res.status(403).send({mensagem: "Token inválido"})};
    //     req.user = payload;
    //     console.log(payload);
    //     next();
    // });

    console.log("passou pelo verify")

};

module.exports = verify;