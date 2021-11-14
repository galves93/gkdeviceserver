var express = require('express');
var app = express();
var dotenv = require("dotenv");
var bodyParser = require("body-parser");
var compresion = require("compression");

app.use(compresion());

app.get("", function (req, res) {
    res.setHeader("Content-Type", "application/json");
});

app.disable('x-powered-by');

(async () => {
    const database = require('./app/config/db.config.js');

    try {
        await database.Sequilize.sync();
    } catch (error) {
        console.log(error);
    }
})();

require('./app/routes/usuario.route.js')(app);

var server = app.listen(process.env.SERVER_PORT, function(){

    var host = server.address().address;
    var port = server.address().port;

    console.log('App listening on http://%s:%s', host, port);
})

module.exports = server;