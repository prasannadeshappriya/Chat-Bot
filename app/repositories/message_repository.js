/**
 * Created by prasanna_d on 9/20/2017.
 */
const rn= require('random-number');

//Models
const messageModel = require('../models/message_model');
const sessionModel = require('../models/session_model');

//Repositories
const entityRepository = require('../repositories/entity_repository');

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
        let result = await sessionModel.createOrUpdateSession(
            session.message.user.id,
            JSON.stringify(session_data)
        );
        if(result[0]){
            console.log('--------------------Session saved to database--------------------------');
            callback(true);}
        else{
            console.log('Error writing session data to the database');
            callback(false);
        }
    },
    sendMessage: async function(data, default_message, callback){
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
                            return callback(output);
                        });
                    } else {
                        return callback(default_message);
                    }
                });
            } else {
                await entityRepository.getEntityData(entity.key, entity.value, async function (flag, result) {
                    if (flag) {
                        let data = result.dataValues.data;
                        await setLineBreaks(data,async function (output) {
                            return callback(output);
                        });
                    } else {
                        return callback(default_message);
                    }
                });
            }
        }else{return callback(default_message);}
    }
};

//Set the line break for message
async function setLineBreaks(lines,callback) {
    let output;
    let data_arr = lines.split('<br>');
    if(data_arr.length>0){output=data_arr[0];}
    if(data_arr.length>1){for(let i=1; i<data_arr.length; i++){output=output + '\n\n' + data_arr[i];}}
    callback(output);
}