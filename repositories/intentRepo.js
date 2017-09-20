/**
 * Created by prasanna on 9/17/17.
 */
const models = require('../database/models');
const con_intent_name = 'intent';

module.exports = {
    deleteIntent: async function(intent_name, callback){
        let result = await models.entity.findOne({
            where:{name: con_intent_name}
        });
        if(result) {
            let entity_id = result.dataValues.id;
            result = await models.entity_data.destroy({
                where: {value: intent_name, entity_id: entity_id}
            });
            if(result>0){return callback([true,result]);}
            else{return callback([false,0]);}
        }else{return callback([false,0]);}
    },
    getIntentAll: async function(callback){
        let result = await models.intent.findAll();
        callback(result);
    },
    updateIntent: async function(intent_name, intent_data, callback){
        let result = await models.entity.findOne({
            where:{name: con_intent_name}
        });
        if(result) {
            let entity_id = result.dataValues.id;
            result = await models.entity_data.update(
                {data: intent_data},
                {where:{value: intent_name, entity_id: entity_id}}
            );
            if(result[0]===1){return callback(true);}
            else{return callback(false);}
        }else{
            return callback([false]);
        }
    },
    getIntent: async function(intent_name, callback){
        let result = await models.entity.findOne({
            where:{name: con_intent_name}
        });
        if(result) {
            let entity_id = result.dataValues.id;
            result = await models.entity_data.findOne({
                where:{entity_id: entity_id, value: intent_name}
            });
            return callback([true,result]);
        }else{
            return callback([false,result]);
        }
    },
    createIntent: async function(intent_name, intent_description,intent_data, callback){
        try {
            let db_response = await models.entity.findOrCreate({
                where: {
                    name: con_intent_name
                },
                defaults: {
                    name: con_intent_name,
                    description: intent_description
                }
            });
            let entity_id = db_response[0].dataValues.id;
            let result = await models.entity_data.findOrCreate({
                where: {
                    entity_id: entity_id,
                    value: intent_name
                },
                defaults: {
                    entity_id: entity_id,
                    value: intent_name,
                    data: intent_data
                }
            });
            return callback([result,true]);
        }catch (err){
            return callback([null,false]);
        }
    }
};