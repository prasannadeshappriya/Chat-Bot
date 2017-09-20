/**
 * Created by prasanna_d on 9/20/2017.
 */
const settingsModel = require('../models/settings_model');

module.exports = {
    getToken: async function(callback){
        // //Sample tokens
        // callback('OLKGXMXBYBDOHC7R3F64J6F3JVW55YLY');
        // callback('6PN2II4QPW5UYG3VPR6EXWFRU6MTTFBH');
        // //Working accessToken
        // callback('IJGWDAD3JJUDWNQYYXOANYHHQXOR5FER');

        let result = await settingsModel.getAll();
        callback(result[0].dataValues.token);
    },
    getAppId: async function(callback){
        let result = await settingsModel.getAll();
        callback(result[0].dataValues.app_id);
    },
    updateSettings: async function(app_id, token){
        try {
            let result = await settingsModel.deleteAll();
            result = await settingsModel.createSettings(app_id, token);
            return [true, {message: 'Success', settings: result.dataValues}];
        }catch (err){return [false, null]}
    },
    getSettings: async function(){
        return await settingsModel.getAll();
    }
};