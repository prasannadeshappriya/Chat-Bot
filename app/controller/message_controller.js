/**
 * Created by prasanna_d on 8/21/2017.
 */
const {Wit, log} = require('node-wit');
const {interactive} = require('node-wit');

//Sessions manage
const sessions = require('../../app');

//Repositories
const settingsRepository = require('../repositories/settings_repository');
const sessionRepository = require('../repositories/session_repository');
const messageRepository = require('../repositories/message_repository');

module.exports = {
    sendBroadcastMessage: async function(bot,builder,message){
        let users = [];
        console.log(message);
        await Object.keys(sessions)
            .forEach(async function (key) {
                let user = sessions[key];
                if(typeof sessions[key].context.address !== 'undefined'){
                    let address = sessions[key].context.address;
                    let msg = await messageRepository.sendMessageByAddress(address,builder,message);
                    let tmp_obj = {name: sessions[key].context.name, id: sessions[key].context.id};
                    users.push(tmp_obj);
                    bot.send(msg);
                }
            });
        return users;
    },
    init: async function(){
        let sessionId;
        //get all stored sessions from the database;
        let stored_sessions = await sessionRepository.getAllSessions();
        console.log(stored_sessions);
        if(stored_sessions[0]) {
            for (let i = 0; i < stored_sessions[1].length; i++){
                let item = stored_sessions[1][i];
                sessionId = item.dataValues.session_id;
                sessions[sessionId] = JSON.parse(item.dataValues.session_data);
            }
        }
    },
    sendMessage: async function (session) {
        console.log('---------User Details------------');
        console.log(session.message.user.id);
        console.log(session.message.user.name);
        console.log(session.message.text.toLowerCase());
        console.log('---------------------------------');

        //Send typing indicator
        session.sendTyping();

        //get access token
        let accessToken;
        await settingsRepository.getToken(function (token) {
            accessToken = token
        });

        const client = new Wit({accessToken: accessToken});
        interactive(client);

        let fbid = session.message.user.id;

        //get session id
        let sessionId;
        await messageRepository.getSessionId(
            sessions, session, function (session_id) {
                sessionId = session_id;
            });

        //write session into database if session does not found
        if(!sessionId){
            console.log('--------------------Creating session for new user----------------------');
            sessionId = session.message.user.id;
            let session_data = {
                fbid: fbid,
                context: {
                    address: session.message.address,
                    id: session.message.user.id,
                    name: session.message.user.name,
                }
            };
            sessions[sessionId] = session_data;
            //Write session to the database
            let result = await sessionRepository.createOrUpdateSession(
                fbid,JSON.stringify(session_data)
            );
            if(result[0]){console.log('--------------------Session saved to database--------------------------');}
        }

        try {
            let data = await client.message(session.message.text.toLowerCase(), {});
            console.log('Wit.ai response: ' + JSON.stringify(data));

            //Set the default message
            let default_message="Hay " + sessions[sessionId].context.name +
                    ", I am sorry. I don't know what you are asking. :(";

            //Send the reply for user
            if(typeof data.entities !== 'undefined'){
                await messageRepository.sendMessage(
                    data, default_message, function (message) {
                        session.send(message);
                    });
            }else {return session.send(default_message);}
        }catch (err){
            console.log(err);
        }
    }
};
