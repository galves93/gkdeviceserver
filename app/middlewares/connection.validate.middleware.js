const db = require("../config/db.config");
const HTTPStatus = require("http-status");
const { ErrorHandler } = require('../error/error');

const isConnectDB = async (req, res, next) => {
    try {
        const isConnected = await db.getConnection().then(connected => connected);

        console.log(db.connected);

        if (!isConnected) {
            throw new ErrorHandler(HTTPStatus.INTERNAL_SERVER_ERROR, "Erro ao conectar com o banco");
        }
        next();

    } catch (error) {
        next(error);

    }
}

module.exports = isConnectDB;