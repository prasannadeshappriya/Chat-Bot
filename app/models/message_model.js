/**
 * Created by prasanna_d on 9/20/2017.
 */

//Repositories
const sessionRepository = require('../repositories/session_repository');

module.exports = {
    //sessions - store the user's session data
    //session - chat session for users

    getSessionId: async function(sessions, session, callback){
        let sessionId;
        Object.keys(sessions).forEach(k => {
            if (sessions[k].fbid === session.message.user.id) {sessionId = k;}
        });
        return callback(sessionId);
    },
    storeSession: async function(session_data, session, callback){
        let result = await sessionRepository.createOrUpdateSession(
            session.message.user.id,
            JSON.stringify(session_data)
        );

    },
    getSsession: async function(sessions, session, callback){
        let sessionId;
        Object.keys(sessions).forEach(k => {
            if (sessions[k].fbid === session.message.user.id) {sessionId = k;}
        });
        if (sessionId) {
            return callback(sessionId, sessions);
        }else{
            // No session found, let's create a new session
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
            let result = await sessionRepository.createOrUpdateSession(fbid,JSON.stringify(session_data));
            if(result[0]){
                console.log('--------------------Session saved to database--------------------------');}
            return callback(sessionId, sessions);
        }
    }
};