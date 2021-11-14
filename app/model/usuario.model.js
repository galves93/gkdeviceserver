module.exports = (sequelize, Sequelize) => {
    const Usuario = sequelize.define('usuario', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        usuario: Sequelize.TEXT,
        senha: Sequelize.TEXT,
        email: Sequelize.TEXT,
        nome: Sequelize.TEXT
    },
    {
        underscored: true,
        schema: 'public'
    }
    );

    return Usuario;
}