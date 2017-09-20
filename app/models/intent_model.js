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
    }
};