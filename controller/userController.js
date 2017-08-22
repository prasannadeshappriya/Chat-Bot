/**
 * Created by prasanna_d on 8/22/2017.
 */
const sessions = require('../app');

module.exports = {
    helloFunction: async function(session, data, sessionId){
        console.log('SessionID: ' + sessionId);
        if(typeof sessions[sessionId].context.name==='undefined'){
            session.send("Hello!, What is your name?");
        }else{
            session.send("Hello " + sessions[sessionId].context.name + ", What can i do for you?");
        }
    },

    nameFunction: async function(session, data, sessionId){
        console.log('SessionID: ' + sessionId);
        let user_name = data.entities.name[0].value;
        sessions[sessionId].context = {name: user_name};
        session.send("Hello " + user_name + ", What can i do for you?");
    },

    helpFunction: async function(session, data){
        session.send("My name is teena, I'm still in development stage.\n\n" +
            "For now, I can help with following problems. I hope to help you more in future :)\n\n" +
            "1 - Leave Policy");
    }
};


