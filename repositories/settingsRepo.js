/**
 * Created by prasanna_d on 9/18/2017.
 */
let model = require('../database/models');
module.exports = {
    getToken: async function(callback){
        let result = await model.settings.findAll();
        callback(result[0].dataValues.token);
    },
    getAppId: async function(callback){
        let result = await model.settings.findAll();
        callback(result[0].dataValues.app_id);
    }
};