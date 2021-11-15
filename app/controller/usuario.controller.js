const db = require("../config/db.config");
var _ = require('lodash');
const jwt = require("jsonwebtoken");
const HTTPStatus = require('http-status');
const {usuario} = require('../validation/usuario');
const { ErrorHandler} = require('../error/error');
const datatable = require('../utils/datatable.utils');
const Sequelize = require("sequelize");
const {Op} = require('sequelize');
const bcrypt = require("bcryptjs")


exports.setUsuario = async (req, res) => {
    const {apiKey} = req.headers;

    if(!apiKey){
        return res.status(HTTPStatus.UNAUTHORIZED).json({message: "Não Autorizado!", data: ""});
    }

    if (!_.isEqual(apikey, "b3ddffe1825da7ab0d651686769fdfe6")) {        
        return res.status(HTTPStatus.UNAUTHORIZED).json({message: "Não Autorizado!", data: ""});
    }

    let userDb = await getUsuarioDB(req.body.usuario);

    if (!_.isEmpty(userDb)) {        
        return res.status(httpStatus.UNAUTHORIZED).json( { message: "Usuário já Cadastrado!", data: "" } );
    }

    let emailDB = await getEmailDB(req.body.email);

    if (!_.isEmpty(emailDB)) {        
        return res.status(httpStatus.UNAUTHORIZED).json( { message: "Email já Cadastrado!", data: "" } );
    }

    const {error} = usuario(req.body);

    if(error){
         return res.status(HTTPStatus.BAD_REQUEST).json({message: 'Json Incorreto! Verifique estrutura!', data: ""});
    }

    req.body.senha = await bcrypt.hash(req.body.senha, 5);

    await saveUsuario(req.body);
    return res.status(HTTPStatus.OK).json({message: 'Usuario cadastrado com sucesso', data: ""});

}

exports.login = async(req, res) => {
    const {login, senha} = req.headers;

    if(!login || !senha){
        return res.status(HTTPStatus.UNAUTHORIZED).json({message: "Login e Senha Requeridos!", data: {}});
    }

    let usuarioDB = await getUsuarioDB(login);

    if (!usuarioDB) {        
        return res.status(HTTPStatus.UNAUTHORIZED).json({ message: "Usuário e/ou senha Inválidos!", data: {} });
    }

    let usuario = await getUsuarioLogin(usuarioDB.id, senha);

    if (!usuario) {        
        return res.status(HTTPStatus.UNAUTHORIZED).json({ message: "Usuário e/ou senha Inválidos!", data: {} });
    }
    // const match = await bcrypt.compare(senha, usuario.senha);

    // if(!match){
    //     return res.status(HTTPStatus.UNAUTHORIZED).json({ message: "Usuário e/ou senha Inválidos!", data: {} });
    // }

    let token = await generateToken(usuarioDB.id, usuarioDB.nome, usuarioDB.cpf, req.headers.senha);

    res.header("Authorization", 'Bearer ' + token);

    let retorno = {
        message: "", 
        data:{
            id: usuarioDB.id, 
            nome: usuarioDB.nome, 
            email: usuarioDB.email,
        }
    }

    return res.status(HTTPStatus.OK).json(retorno);
   
}

getUsuarioDB = async (usuario) => {
    return await db.usuario.findOne({
        where: {
            usuario: usuario
        },
        attributes: {
            exclude: ['senha']
        },

    }).then(usuario => {
        return usuario;
    }).catch((error) => {
        console.error('Sequelize Error: ', error);
        return Promise.reject(new ErrorHandler(HTTPStatus.INTERNAL_SERVER_ERROR, 'Internal Serever Error.'));
    });
};


getEmailDB = async (email) => {
    return await db.usuario.findOne({
        where: {
            email: email
        },
        attributes: {
            exclude: ['senha']
        },

    }).then(email => {
        return email;
    }).catch((error) => {
        console.error('Sequelize Error: ', error);
        return Promise.reject(new ErrorHandler(HTTPStatus.INTERNAL_SERVER_ERROR, 'Internal Serever Error.'));
    });
};

saveUsuario = async (usuario) => {
    return await db.usuario.create(usuario)
        .then(saved => {
            return saved;
        })
        .catch((error) => {
            console.error('Sequelize Error: ', error);
            return Promise.reject(new ErrorHandler(HTTPStatus.INTERNAL_SERVER_ERROR, error.message));
        });
};

getUsuarioLogin = async (idusuario, senha) => {
    return await db.usuario.findOne({
        raw: true,
        nest: true,
        where: {
                'id': idusuario
        },
    }).then(usuario => {
        return usuario;
    }).catch((error) => {
        console.error('Sequelize Error: ', error);
        return Promise.reject(new ErrorHandler(HTTPStatus.INTERNAL_SERVER_ERROR, 'Internal Serever Error.'));
    });
};

/**
 *  GERA UM NOVO TOKEN JWT
 */
 generateToken = async (idusuario, nomeusuario, cpf, senha) => {

    const token = jwt.sign({
      id: idusuario,
      name: nomeusuario,
      senha: senha
    },
      process.env.TOKEN_SECRET, {
      expiresIn: process.env.TOKEN_EXPIRES_IN
    }
    );
  
    return token;
  };