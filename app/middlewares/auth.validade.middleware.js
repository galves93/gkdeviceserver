const jwt = require('jsonwebtoken');

function verifyJWT(req, res, next){
    const token = req.headers['authorization'];

    if(!token || !token.startsWith('Bearer ')) return res.status(401).send({message: "não autorizado"});

    const hash = token.substring(7, token.lenght);

    jwt.verify(hash, process.env.TOKEN_SECRET, function(err, decodec){
        if(err) return res.status(500).send({messagem: 'nao autorizado'});

        req.userId = decodec.id;
    })
}

module.exports = verifyJWT;