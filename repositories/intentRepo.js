/**
 * Created by prasanna on 9/17/17.
 */
let models = require('../database/models');
module.exports = {
    deleteIntent: async function(intent_name, callback){
        let result = await models.intent.destroy({
            where: {name: intent_name}
        });
        callback(result);
    },
    getIntentAll: async function(callback){
        let result = await models.intent.findAll();
        callback(result);
    },
    createIntent: async function(intent_name, intent_description, callback){
        let db_response = await models.intent.findOrCreate({
            where: {
                name: intent_name
            },
            defaults: {
                name: intent_name,
                description: intent_description
            }
        });
        callback(db_response);
    }
};