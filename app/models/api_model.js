/**
 * Created by prasanna_d on 11/28/2017.
 */
//Import database connection [Sequelize]
let model = require('../database/models');

module.exports = {
    createAPI: async function(connection_data){
        try {
            return await model.api_info.create({
                connection_data: connection_data
            });
        }catch (err){
            console.log(err); //Display error message
            return null;
        }
    },
    getAllAPIs: async function(){
        try{
            return await model.api_info.findAll();
        }catch (err){
            //When error
            return [];
        }
    }
};