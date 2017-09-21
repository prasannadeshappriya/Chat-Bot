/**
 * Created by prasanna_d on 8/18/2017.
 */
const bodyParser = require('body-parser');
const restify = require('restify');
const builder = require('botbuilder');
const debug = require('debug')('hairb2b-server:server');
const logger = require('morgan');
const http = require('http');
const cors = require('cors');
const models = require('./app/database/models');
const restify_plugin = require('restify-plugins');

//Configure Database---------------------------------------------
models.sequelize.sync().then(function () {
    console.log("Database is connected");
});
//---------------------------------------------------------------

//Token validator
const passport = require('./app/middleware/passport');

//Controllers
const mainController = require('./app/controller/message_controller');

//Manage sessions
const sessions = {};

// Setup Restify Server
let server = restify.createServer();
server.use(cors());
server.use(restify_plugin.jsonp());
server.use(restify.plugins.queryParser());
server.use(restify.plugins.jsonBodyParser());
server.use(restify.plugins.urlEncodedBodyParser({ extended: false }));

//Handle restify server cores headers ---------------------------------------------------------------------
function corsHandler(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, Accept, Accept-Version, ' +
        'Content-Length, Content-MD5, Content-Type, Date, ' +
        'X-Api-Version, X-Response-Time, X-PINGOTHER, ' +
        'X-CSRF-Token,Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Expose-Headers', 'X-Api-Version, X-Request-Id, X-Response-Time');
    res.setHeader('Access-Control-Max-Age', '1000');
    return next();
}
function optionsRoute(req, res, next) {res.send(200);return next();}
server.use(cors({
    credentials: true,                 // defaults to false
    methods: ['GET','PUT','DELETE','POST','OPTIONS']
}));
server.opts('/\.*/', corsHandler, optionsRoute);
//---------------------------------------------------------------------------------------------------------

server.listen(process.env.port || process.env.PORT || 3000, function () {
    console.log('%s message server listening to %s', server.name, server.url);
});

//Microsoft bot framework id and password
let connector = new builder.ChatConnector({
    appId: "ab2d1a14-71e9-48a2-9bdb-d9b94cf9aa1a",
    appPassword: "AbKPomU0PRVkEEzoOo3Sejf"
});

//Create bot
let bot = new builder.UniversalBot(connector);

//Server routes
require('./app/routes/index')(
    server,passport,connector,bot,builder);

//Bot on
bot.on('contactRelationUpdate', function (message) {
    if (message.action === 'add') {
        let name = message.user ? message.user.name : null;
        let reply = new builder.Message()
            .address(message.address)
            .text("Hello %s... Thanks for adding me. Say 'hello' to see some great demos.", name || 'there');
        bot.send(reply);
    } else {
        if (message.action === 'remove') {
            console.log('testing');
        }
    }
});
bot.on('typing', function (message) {
    // User is typing
});
bot.on('deleteUserData', function (message) {
    // User asked to delete their data
});

// Bots Dialogs
String.prototype.contains = function(content){
    return this.indexOf(content) !== -1;
};

//Get all stored sessions in to the server from the database;
mainController.init();
bot.dialog('/', mainController.sendMessage);

module.exports = sessions;

