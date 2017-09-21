/**
 * Created by prasanna_d on 9/21/2017.
 */
//Models
const settingsModel = require('../models/settings_model');
module.exports = {
    getWitServerAccessToken: async function(){
        let result = await settingsModel.getAll();
        return 'Bearer ' + result[0].dataValues.token;
    }
};