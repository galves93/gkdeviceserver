const Joi = require("joi");
const pt_BR = require("../language/pt-BR");

const usuario = data => {
    const schema = Joi.object({
        nome: Joi.string().min(4).max(80).required(),
        senha: Joi.string().required(),
        email: Joi.string().required(),
        usuario: Joi.string().required()
    });

    return schema.validate(data, {
        language: pt_BR.errors
    });
};

module.exports.usuario = usuario;