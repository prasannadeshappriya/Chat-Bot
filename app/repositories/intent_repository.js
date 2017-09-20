/**
 * Created by prasanna on 9/17/17.
 */
//Models
const entityModel = require('../models/entity_model');
const entityDataModel = require('../models/entity_data_model');
const intentModel = require('../models/intent_model');

//Constants
const con_intent_name = 'intent';

module.exports = {
    deleteIntent: async function(intent_name, callback){
        let result = await entityModel.getEntityByName(con_intent_name);
        if(result) {
            let entity_id = result.dataValues.id;
            result = await entityDataModel.deleteEntityData(
                entity_id, intent_name
            );
            if(result>0){return callback([true,result]);}
            else{return callback([false,0]);}
        }else{return callback([false,0]);}
    },
    getIntentAll: async function(callback){
        let result = await intentModel.getAllIntents();
        let resData = [];
        Object.keys(result)
            .forEach(function (key) {
                resData.push({
                    name: result[key].dataValues.name,
                    description: result[key].dataValues.description,
                });
            });
        callback(resData);
    },
    updateIntent: async function(intent_name, intent_data, callback){
        let result = await entityModel.getEntityByName(con_intent_name);
        if(result) {
            let entity_id = result.dataValues.id;
            result = await entityDataModel.updateEntityData(
                entity_id, intent_name, intent_data
            );
            if(result[0]===1){return callback(true);}
            else{return callback(false);}
        }else{
            return callback([false]);
        }
    },
    getIntent: async function(intent_name, callback){
        let result = await entityModel.getEntityByName(con_intent_name);
        if(result) {
            let entity_id = result.dataValues.id;
            result = await entityDataModel.getEntityData(
                entity_id, intent_name
            );
            return callback([true,result]);
        }else{
            return callback([false,result]);
        }
    },
    createIntent: async function(intent_name, intent_description,intent_data, callback){
        try {
            let result = await entityModel.findOrCreateEntity(
                con_intent_name, intent_description
            );
            let entity_id = result[0].dataValues.id;
            result = await entityDataModel.findOrCreateEntityData(
                entity_id, intent_name, intent_data
            );
            return callback([result,true]);
        }catch (err){
            return callback([null,false]);
        }
    }
};