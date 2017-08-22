/**
 * Created by prasanna_d on 8/21/2017.
 */
const {Wit, log} = require('node-wit');
const {interactive} = require('node-wit');
const leaveController = require('./leaveController');
const helloController = require('./helloController');
const leavePolicyController = require('./leavePolicyController');

module.exports = {
    sendMessage: async function (session) {
        console.log(session.message.text.toLowerCase());

        // const client = new Wit({accessToken: 'OLKGXMXBYBDOHC7R3F64J6F3JVW55YLY'});
        const client = new Wit({accessToken: 'IJGWDAD3JJUDWNQYYXOANYHHQXOR5FER'});
        // const client = new Wit({accessToken: '6PN2II4QPW5UYG3VPR6EXWFRU6MTTFBH'});

        interactive(client);
        try {
            var data = await client.message(session.message.text.toLowerCase(), {});
            console.log('Wit.ai response: ' + JSON.stringify(data));
            if(typeof data.entities.greetings!=='undefined' && data.entities.greetings[0].value==='true'){
                return helloController.helloFunction(session, data);
            }
            if(typeof data.entities.leave!=='undefined'){
                return leaveController.leaveFunction(session, data);
            }if(typeof data.entities.leavePolicy!=='undefined'){
                return leavePolicyController.leavePolicyFunction(session, data);
            }
            session.send(`Hay, i'm still under construction! try again in a little bit`);
        }catch (err){
            console.log(err);
        }
    }
};