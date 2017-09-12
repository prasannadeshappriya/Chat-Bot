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

//Token validator
let token_validator = require('./middleware/auth');

//Controllers
const mainController = require('./controller/mainController');
const dashboardController = require('./controller/dashboardController');
const witController = require('./controller/witController');
const userController = require('./controller/userController');

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

function corsHandler(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Response-Time, X-PINGOTHER, X-CSRF-Token,Authorization');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Expose-Headers', 'X-Api-Version, X-Request-Id, X-Response-Time');
    res.setHeader('Access-Control-Max-Age', '1000');
    return next();
}

function optionsRoute(req, res, next) {
    res.send(200);
    return next();
}

server.use(cors({
    credentials: true,                 // defaults to false
    methods: ['GET','PUT','DELETE','POST','OPTIONS']
}));

/*
 routes and authentication handlers
 */

server.opts('/\.*/', corsHandler, optionsRoute);

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

//Server routes
server.post('/intent/create',function (req,res) {token_validator.tokenAuth(req,res, function (req,res) {dashboardController.createIntent(req,res);})});
server.get('/intent/get',function (req,res) {token_validator.tokenAuth(req,res, function (req,res) {dashboardController.getIntent(req,res);})});
server.post('/intent/delete',function (req,res) {token_validator.tokenAuth(req,res, function (req,res) {dashboardController.deleteIntent(req,res);})});
server.post('/entity/create',function (req,res) {token_validator.tokenAuth(req,res, function (req,res) {dashboardController.createEntity(req,res);})});
server.get('/entity/get',function (req,res) {token_validator.tokenAuth(req,res, function (req,res) {dashboardController.getEntity(req,res);})});
server.get('/wit/getEntityById',function (req,res) {token_validator.tokenAuth(req,res, function (req,res) {witController.getEntityById(req,res);})});
server.get('/wit/getEntities',function (req,res) {token_validator.tokenAuth(req,res, function (req,res) {witController.getEntities(req,res);})});
server.post('/wit/putEntityById',function (req,res) {token_validator.tokenAuth(req,res, function (req,res) {witController.putEntityById(req,res);})});
server.post('/wit/postEntity',function (req,res) {token_validator.tokenAuth(req,res, function (req,res) {witController.postEntity(req,res);})});
server.get('/wit/getMessage',function (req,res) {token_validator.tokenAuth(req,res, function (req,res) {witController.getMessage(req,res);})});
server.post('/wit/postSample',function (req,res) {token_validator.tokenAuth(req,res, function (req,res) {witController.postSample(req,res);})});

//Backup route
// server.post('/api/messages', connector.listen());
// server.post('/intent/create', dashboardController.createIntent);
// server.get('/intent/get', dashboardController.getIntent);
// server.post('/intent/delete', dashboardController.deleteIntent);
// server.post('/entity/create', dashboardController.createEntity);
// server.get('/entity/get', dashboardController.getEntity);
// server.get('/wit/getEntityById', witController.getEntityById);
// server.get('/wit/getEntities', witController.getEntities);
// server.post('/wit/putEntityById', witController.putEntityById);
// server.post('/wit/postEntity', witController.postEntity);
// server.get('/wit/getMessage', witController.getMessage);
// server.post('/wit/postSample', witController.postSample);

//User Authentication Routes
server.post('user/create', userController.register);
server.post('user/login', userController.login);

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

