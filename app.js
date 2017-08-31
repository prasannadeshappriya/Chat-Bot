/**
 * Created by prasanna_d on 8/18/2017.
 */
const express = require('express');
const bodyParser = require('body-parser');
const restify = require('restify');
const builder = require('botbuilder');
const debug = require('debug')('hairb2b-server:server');
const logger = require('morgan');
const http = require('http');

//Configure express server app------------------------------------------
const routes = require('./routes/routes');
const app = express();
const port = normalizePort(process.env.PORT || '4000');
const server = http.createServer(app);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set('port', port);
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500).json({error: err.status + ' - ' + err.message});
});

server.listen(port, function () {
    console.log('server listening to port: %s', port);
});
server.on('error', onError);
server.on('listening', onListening);

function normalizePort(val) {
    let port = parseInt(val, 10);
    if (isNaN(port)) {return val;}  // named pipe
    if (port >= 0) {return port;} // port number
    return false;
}
function onError(error) {
    if (error.syscall !== 'listen') {throw error;}
    let bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;
    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);break;
        default:
            throw error;
    }
}
function onListening() {
    let addr = server.address();
    let bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}
//---------------------------------------------------------------

//Controllers
const mainController = require('./controller/mainController');
const dashboardController = require('./controller/dashboardController');

//Manage sessions
const sessions = {};

// Setup Restify Server
let message_server = restify.createServer();
message_server.listen(process.env.port || process.env.PORT || 3000, function () {
    console.log('%s message server listening to %s', message_server.name, message_server.url);
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
message_server.post('/api/messages', connector.listen());

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
module.exports = message_server;
module.exports = app;

