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
const models = require('./database/models');

//Configure Database---------------------------------------------
models.sequelize.sync().then(function () {
    console.log("Database is connected");
});
//---------------------------------------------------------------

//Controllers
const mainController = require('./controller/mainController');
const dashboardController = require('./controller/dashboardController');

//Manage sessions
const sessions = {};

const restify_plugin = require('restify-plugins');

// Setup Restify Server
let server = restify.createServer();
server.use(cors());
server.use(restify_plugin.jsonp());
server.use(restify.plugins.queryParser());
server.use(restify.plugins.jsonBodyParser());
server.use(restify.plugins.urlEncodedBodyParser({ extended: false }));

server.listen(process.env.port || process.env.PORT || 3000, function () {
    console.log('%s message server listening to %s', server.name, server.url);
});

// Microsoft bot framework
//Sithara
// var connector = new builder.ChatConnector({
//     appId: "246c3ebe-816f-4a5e-851b-bb3e8247bbe1",
//     appPassword: "7EVkPaNttWKhOWkcKHSpY0Q"
// });
//Prasanna
let connector = new builder.ChatConnector({
    appId: "ab2d1a14-71e9-48a2-9bdb-d9b94cf9aa1a",
    appPassword: "AbKPomU0PRVkEEzoOo3Sejf"
});

let bot = new builder.UniversalBot(connector);

//Message server routes
server.post('/api/messages', connector.listen());
server.post('/intent/create', dashboardController.createIntent);
server.get('/intent/get', dashboardController.getIntent);
server.post('/entity/create', dashboardController.createEntity);
server.get('/entity/get', dashboardController.getEntity);

//Bot on
bot.on('contactRelationUpdate', function (message) {
    if (message.action === 'add') {
        let name = message.user ? message.user.name : null;
        let reply = new builder.Message()
            .address(message.address)
            .text("Hello %s... Thanks for adding me. Say 'hello' to see some great demos.", name || 'there');
        bot.send(reply);
    } else {
        // delete their data
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

bot.dialog('/', mainController.sendMessage);

module.exports = sessions;
module.exports = server;
// module.exports = app;

