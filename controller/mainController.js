/**
 * Created by prasanna_d on 8/21/2017.
 */
const {Wit, log} = require('node-wit');
const {interactive} = require('node-wit');
const leaveController = require('./leaveController');
const userController = require('./userController');
const leavePolicyController = require('./leavePolicyController');
const sessions = require('../app');

module.exports = {
    sendMessage: async function (session) {
        console.log('---------User Details------------');
        console.log(session.message.user.id);
        console.log(session.message.user.name);
        console.log(session.message.text.toLowerCase());
        console.log('---------------------------------');

        //---------------------------------Token and session management---------------------------------------
        // let accessToken = 'OLKGXMXBYBDOHC7R3F64J6F3JVW55YLY';
        // let accessToken = '6PN2II4QPW5UYG3VPR6EXWFRU6MTTFBH';
        let accessToken = 'IJGWDAD3JJUDWNQYYXOANYHHQXOR5FER';
        const client = new Wit({accessToken: accessToken});
        interactive(client);

        let fbid = session.message.user.id;
        let sessionId;
        // Let's see if we already have a session for the user fbid
        Object.keys(sessions).forEach(k => {
            if (sessions[k].fbid === fbid) {
                sessionId = k;
            }
        });
        if (!sessionId) {
            // No session found for user fbid, let's create a new one
            sessionId = session.message.user.id;
            sessions[sessionId] = {fbid: fbid, context: {}};
        }
        //------------------------------------------------------------------------

        try {
            var data = await client.message(session.message.text.toLowerCase(), {});
            console.log('Wit.ai response: ' + JSON.stringify(data));
            if(typeof data.entities.name!=='undefined'){
                return userController.nameFunction(session, data, sessionId);
            }
            if(typeof data.entities.greetings!=='undefined' && data.entities.greetings[0].value==='true'){
                return userController.helloFunction(session, data, sessionId);
            }
            //if user ask without telling their name
            if(typeof sessions[sessionId].context.name==="undefined"){
                return session.send("I can help you. But before we begin, what is your name?");
            }

            if(typeof data.entities.leave!=='undefined'){
                return leaveController.leaveFunction(session, data);
            }
            if(typeof data.entities.leavePolicy!=='undefined'){
                return leavePolicyController.leavePolicyFunction(session, data);
            }
            if(typeof data.entities.help!=='undefined'){
                return userController.helpFunction(session, data);
            }
            if(typeof sessions[sessionId].context.name==='undefined'){
                session.send("Hay, i'm still under construction!. Try basic commands :)");
            }else{
                session.send("Hay " + sessions[sessionId].context.name + ", i'm still under construction!. Try basic commands :)");
            }
        }catch (err){
            console.log(err);
        }
    }
};