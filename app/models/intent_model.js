/**
 * Created by prasanna_d on 9/20/2017.
 */
let model = require('../database/models');
const con_intent_name = 'intent';

module.exports = {
    getAllIntents: async function () {
        try {
            return await model.intent.findAll();
        } catch (err) {
            console.log(err); //Display error message
            return null;
        }
    },
    getIntentId: async function(){
        try {
            return await model.entity.findOne({
                where:{name: 'intent'}
            });
        }catch (err){
            console.log(err); //Display error message
            return null;
        }
    },
    getAllIntentNames: async function (intent_id) {
        try {
            return await model.entity_data.findAll({
                where: {
                    entity_id : intent_id
                }
            });
        } catch (err) {
            console.log(err); //Display error message
            return null;
        }
    }
};