/**
 * Created by prasanna_d on 8/22/2017.
 */
const sessions = require('../app');

module.exports = {
    helloFunction: async function(session, data, sessionId){
        sessions[sessionId].context.controller = {};
        console.log('SessionID: ' + sessionId);
        if(typeof sessions[sessionId].context.name==='undefined'){
            session.send("Hello!, What is your name?");
        }else{
            session.send("Hello " + sessions[sessionId].context.name + ", What can i do for you?");
        }
    },

    nameFunction: async function(session, data, sessionId){
        sessions[sessionId].context.controller = {};
        console.log('SessionID: ' + sessionId);
        let user_name = data.entities.name[0].value;
        sessions[sessionId].context.name = user_name;
        if(typeof sessions[sessionId].context.preQuection!=="undefined" && sessions[sessionId].context.preQuection) {
            sessions[sessionId].context.preQuection = false;
            session.send("Hello " + user_name + ", Shall we start the conversation now, what can i do for you?");
            return;
        }
        session.send("Hello " + user_name + ", What can i do for you?");
    },

    helpFunction: async function(session, data){
        sessions[sessionId].context.controller = {};
        session.send("My name is teena, I'm still in development stage.\n\n" +
            "For now, I can help with following problems. I hope to help you more in future :)\n\n" +
            "1 - Leave Policy");
    }
};


