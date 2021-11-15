module.exports = function (app) {
    const usuarioCtrl = require("../controller/usuario.controller");
    const isConnectedDB = require("../middlewares/connection.validate.middleware");
    const ascynHandler = require("express-async-handler");
    const verifyJWT = require('../middlewares/auth.validade.middleware');

    let rotaUsuario = '/ap1/v1/gkdeviceserver/usuario';

    app.use(isConnectedDB);

    app.post(rotaUsuario, ascynHandler(usuarioCtrl.setUsuario));

    app.get(rotaUsuario, ascynHandler(usuarioCtrl.login));
}