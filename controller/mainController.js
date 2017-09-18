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
        // Let's see if we already have a session for the user fbid
        Object.keys(sessions).forEach(k => {
            if (sessions[k].fbid === fbid) {
                sessionId = k;
            }
        });
        if (!sessionId) {
            // No session found for user fbid, let's create a new one
            sessionId = session.message.user.id;
            sessions[sessionId] = {fbid: fbid, context: {
                address: session.message.address,
                id: session.message.user.id,
                name: session.message.user.name,
            }};
        }
        //----------------------------------------------------------------------------------------------------

        try {
            let data = await client.message(session.message.text.toLowerCase(), {});
            console.log('Wit.ai response: ' + JSON.stringify(data));
            //Set the default message
            if(typeof sessions[sessionId].context.name==='undefined'){
                let default_message="I am sorry. I don't know what you are asking " +
                    ":(. For the moment I can help you with\n\n 1.Leave Policy";
            }else{
                let default_message="Hay " + sessions[sessionId].context.name + ", I am sorry." +
                    " I don't know what you are asking :(.\n\n For the moment I can help you with,\n\n 1.Leave Policy";
            }
            let default_message="I am sorry. I don't know what you are asking :(. For the moment I can help you with\n\n 1.Leave Policy";
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
                for(let i=0; i<entities.length; i++){
                    if(entity.confidence<entities[i].confidence){entity=entities[i];}
                }
                if (entity) {
                    console.log('---------Search Entity----------');
                    console.log(entity.key + ':');
                    console.log(entity);
                    console.log('--------------------------------');
                    if (entity.value === 'true') {
                        await entityRepository.getEntityData(entity.key, null, function (flag, result) {
                            if (flag) {
                                let options = {min: 0, max: result.length, integer: true};
                                let data = result[rn(options)].dataValues.data;
                                return session.send(data);
                            } else {
                                return session.send(default_message);
                            }
                        });
                    } else {
                        await entityRepository.getEntityData(entity.key, entity.value, function (flag, result) {
                            if (flag) {
                                let data = result.dataValues.data;
                                return session.send(data);
                            } else {
                                return session.send(default_message);
                            }
                        });
                    }
                }else{return session.send(default_message);}
            }else {return session.send(default_message);}

            // if(typeof data.entities.name!=='undefined'){
            //     return userController.nameFunction(session, data, sessionId);
            // }
            // if(typeof data.entities.greetings!=='undefined' && data.entities.greetings[0].value==='true'){
            //     return userController.helloFunction(session, data, sessionId);
            // }
            // //if user ask without telling their name
            // if(typeof sessions[sessionId].context.name==="undefined"){
            //     sessions[sessionId].context.preQuection = true;
            //     let reply = ["I can help you. But before we begin, what is your name?",
            //         "Let's start with your name",
            //         "I need your name to continue :)"];
            //     let options = {min: 0, max: 2, integer: true};
            //     return session.send(reply[rn(options)]);
            // }
            // if(typeof data.entities.leave!=='undefined'){
            //     return leaveController.leaveFunction(session, data, sessionId);
            // }
            // if(typeof data.entities.leavePolicy!=='undefined'){
            //     return leavePolicyController.leavePolicyFunction(session, data, sessionId);
            // }
            // if(typeof data.entities.help!=='undefined'){
            //     return userController.helpFunction(session, data, sessionId);
            // }
            // if(data._text.contains("thank")){
            //     sessions[sessionId].context.controller = {};
            //     let rpThank= ["You're Welcome...","No problem...","Don't mention it...","It's no bother...","My pleasure...","It's all right...","It's nothing"];
            //     let smiley=[":D",":)","(like)","(yn)",";)","(nod)"];
            //     let options={min:0, max: 6, integer: true};
            //     session.send(rpThank[rn(options)]);
            //     return session.send(smiley[rn(options)]);
            // }
            // if(typeof sessions[sessionId].context.controller!=='undefined'){
            //     if(sessions[sessionId].context.controller.name==="leave"){
            //         return leaveController.leaveFunction(session, data, sessionId);
            //     }
            // }
            // if(typeof data.entities.fun!=='undefined'){
            //     return session.send("Please ask me about the company policies and the problems regarding the company :)\n\n" +
            //         "Don't tell me your personal problems :P");
            // }
            // if(typeof sessions[sessionId].context.name==='undefined'){
            //     session.send("I am sorry. I don't know what you are asking :(. For the moment I can help you with\n\n" +
            //         "1.Leave Policy");
            // }else{
            //     session.send("Hay " + sessions[sessionId].context.name + ", I am sorry. I don't know what you are asking :(.\n\n For the moment I can help you with,\n\n" +
            //         "1.Leave Policy");
            // }
        }catch (err){
            console.log(err);
        }
    }
};
