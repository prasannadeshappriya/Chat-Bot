/**
 * Created by prasanna_d on 9/15/2017.
 */
//Repositories
const settingsRepository = require('../repositories/settings_repository');

module.exports = {
    updateSettings: async function(req,res){
        if(typeof req.body==='undefined'){
            return res.send(400,{message: 'token and app_id required'});}
        let token = req.body.token;
        let app_id = req.body.app_id;
        if(typeof token==='undefined' ||
            token===''){return res.send(400,{message: 'token required'});}
        if(typeof app_id==='undefined' ||
            app_id===''){return res.send(400,{message: 'app_id required'});}
        try {
            let result = await settingsRepository.updateSettings(app_id,token);
            if(result[0]) {
                return res.json(201, {message: 'Success', settings: result[1].dataValues});
            }else{return res.json(500, {message: 'internal server error'});}
        }catch (err){return res.json(500, {message: 'internal server error'});}
    },
    getSettings: async function(req,res){
        try {
            let result = await settingsRepository.getSettings();
            return res.json(201, {message: 'Success', settings: result[0].dataValues});
        }catch (err){return res.json(500, {message: 'internal server error'});}
    }
};