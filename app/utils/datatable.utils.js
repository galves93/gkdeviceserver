const _ = require("lodash");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

module.exports = async (req, attributes, whereParams) => {
    var queryParams = {
        search: req.query.search,
        order: req.query.order,
        start: req.query.start,
        lenght: req.query.lenght,
        dir: req.query.dir
    };

    let findParams = {
        returning: true
    };

    const camposTabela = ['id, usuario, senha, email, nome'];

    console.log(queryParams.order);
    if (!(queryParams.order in camposTabela)) {
        queryParams.order = null
    };

    findParams.order = [
        [
            queryParams.order == null ? 'id' : queryParams.order,
            queryParams.dir == null ? 'asc' : queryParams.dir,
        ]
    ];

    findParams.where = whereParams;
    findParams.limit = queryParams.limit;
    findParams.offset = queryParams.offset;
    findParams.attributes = attributes;

    return objectDatatable = _.merge(findParams, whereParams);

}