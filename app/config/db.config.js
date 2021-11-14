const { Sequelize } = require('sequelize');
const Sequelize = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_DATABASE,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: "postgres",
        timestamps: false,
        logging: process.env.DB_ENV == "prod" ? true : false,
        port: process.env.DB_PORT,
        define: {
            timestamps: false,
            freezeTableName: true
        },

        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        retry: {
            match: [
                /SequelizeConnectionError/,
                /SequelizeConnectionRefusedError/,
                /SequelizeHostNotFoundError/,
                /SequelizeHostNotReachableError/,
                /SequelizeInvalidConnectionError/,
                /SequelizeConnectionTimedOutError/

            ],
            name: 'query',
            backoffBase: 100,
            backoffExponent: 1.1,
            timeout: 60000,
            max: Infinity
        }

    }
);

let isConnected = false;

sequelize.authenticate().then(function () {
    isConnected = true;
    console.log("conectado com sucesso");
}).catch(error => {
    isConnected = false;
    console.error(error + "erro ao conectar ao banco");
});

const checkConnection = async () => {
    return new Promise((resolve) => {
        resolve(isConnected);
    });
};

const db = {}

db.Sequelize = sequelize;
db.getConnection = checkConnection;

db.usuario = require("../model/usuario.model")(sequelize, Sequelize);

module.exports = db;