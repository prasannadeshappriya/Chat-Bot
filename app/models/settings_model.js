/**
 * Created by prasanna_d on 9/20/2017.
 */

const model = require('../database/models');

module.exports = {
    getAll: async function(){
        try{
            return await model.settings.findAll();
        } catch (err) {
            console.log(err); //Display error message
            return null;
        }
    },
    deleteAll: async function(){
        try{
            return await model.settings.destroy({
                where: {}
            });
        } catch (err) {
            console.log(err); //Display error message
            return null;
        }
    },
    createSettings: async function(app_id, token){
        try{
            return await model.settings.create({
                app_id: app_id,
                token: token
            });
        } catch (err) {
            console.log(err); //Display error message
            return null;
        }
    }
};