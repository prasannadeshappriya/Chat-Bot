/**
 * Created by prasanna_d on 8/21/2017.
 */
const {Wit, log} = require('node-wit');
const {interactive} = require('node-wit');
const rn= require('random-number');

//Sessions manage
const sessions = require('../app');

//Controllers
const leaveController = require('../bot_controller/leaveController');
const userController = require('../bot_controller/userController');
const leavePolicyController = require('../bot_controller/leavePolicyController');

//Repositories
const settingsRepository = require('../repositories/settingsRepo');
const entityRepository = require('../repositories/entityRepo');
const sessionRepository = require('../repositories/sessionRepo');

//Set the line break for message
async function setLineBreaks(lines,callback) {
    let output;
    let data_arr = lines.split(' \\n\\n ');
    if(data_arr.length>0){output=data_arr[0];}
    if(data_arr.length>1){for(let i=1; i<data_arr.length; i++){output=output + '\n\n' + data_arr[i];}}
    callback(output);
}

module.exports = {
    sendBroadcastMessage: async function(bot,builder,message){
        let users = [];
        await Object.keys(sessions)
            .forEach(function (key) {
                let user = sessions[key];
                if(typeof sessions[key].context.address !== 'undefined'){
                    let address = sessions[key].context.address;
                    let msg = new builder.Message().address(address);
                    let user_message;
                    for(let i=0; i<message.length; i++){
                        if(i===0){user_message=message[i];}
                        else{user_message = user_message + '\n\n' + message[i];}
                    }
                    msg.text(user_message);msg.textLocale('en-US');
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

        //---------------------------------Token and session management---------------------------------------
        // let accessToken = 'OLKGXMXBYBDOHC7R3F64J6F3JVW55YLY';
        // let accessToken = '6PN2II4QPW5UYG3VPR6EXWFRU6MTTFBH';
        // let accessToken = 'IJGWDAD3JJUDWNQYYXOANYHHQXOR5FER';    //Working accessToken

        let accessToken;
        await settingsRepository.getToken(function (token) {
            accessToken = token;
        });

        const client = new Wit({accessToken: accessToken});
        interactive(client);

        let fbid = session.message.user.id;
        let sessionId;

        Object.keys(sessions).forEach(k => {
            if (sessions[k].fbid === fbid) {
                sessionId = k;
            }
        });
        if (!sessionId) {
            // No session found for user fbid, let's create a new one
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
            if(result[0]){console.log('--------------------Session saved to database--------------------------');}
        }
        //----------------------------------------------------------------------------------------------------

        try {
            let data = await client.message(session.message.text.toLowerCase(), {});
            console.log('Wit.ai response: ' + JSON.stringify(data));

            //Set the default message
            let default_message="Hay " + sessions[sessionId].context.name + ", I am sorry. I don't know what you are asking. :(";

            if(typeof data.entities !== 'undefined'){
                let entity = null; let key='';
                let entities = [];
                Object.keys(data.entities)
                    .forEach(async function (_key) {
                        if (data.entities[_key].length > 0) {
                            entity = data.entities[_key][0];
                            entity.key = _key;
                            for (let i = 0; i < data.entities[_key].length; i++) {
                                if (entity.confidence < data.entities[_key][i].confidence) {
                                    entity = data.entities[_key][i]; entity.key = _key;
                                }
                            }
                            entities.push(entity);
                        }
                    });
                if(entities.length>0){entity = entities[0];}
                let intent;
                for(let i=0; i<entities.length; i++){
                    if(entity.confidence<entities[i].confidence){entity=entities[i];}
                    if(entity.key==='intent'){intent=entities[i];}
                }
                if(intent){
                    console.log('intent transaction');
                }
                if (entity) {
                    let output;
                    console.log('---------Search Entity----------');
                    console.log(entity.key + ':');
                    console.log(entity);
                    console.log('--------------------------------');
                    if (entity.value === 'true') {
                        await entityRepository.getEntityData(entity.key, null, async function (flag, result) {
                            if (flag) {
                                let options = {min: 0, max: (result.length-1), integer: true};
                                let data = result[rn(options)].dataValues.data;
                                await setLineBreaks(data,async function (output) {
                                    return session.send(output);
                                });
                            } else {
                                return session.send(default_message);
                            }
                        });
                    } else {
                        await entityRepository.getEntityData(entity.key, entity.value, async function (flag, result) {
                            if (flag) {
                                let data = result.dataValues.data;
                                await setLineBreaks(data,async function (output) {
                                    return session.send(output);
                                });
                            } else {
                                return session.send(default_message);
                            }
                        });
                    }
                }else{return session.send(default_message);}
            }else {return session.send(default_message);}
        }catch (err){
            console.log(err);
        }
    }
};
