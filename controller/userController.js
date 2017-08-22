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
    }
};


