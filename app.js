/**
 * Created by prasanna_d on 8/18/2017.
 */
const restify = require('restify');
const builder = require('botbuilder');
const mainController = require('./controller/mainController');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3000, function () {
    console.log('%s listening to %s', server.name, server.url);
});

// Create chat bot
var connector = new builder.ChatConnector({
    appId: "ab2d1a14-71e9-48a2-9bdb-d9b94cf9aa1a",
    appPassword: "AbKPomU0PRVkEEzoOo3Sejf"
});

var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());
//Bot on
bot.on('contactRelationUpdate', function (message) {
    if (message.action === 'add') {
        var name = message.user ? message.user.name : null;
        var reply = new builder.Message()
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



