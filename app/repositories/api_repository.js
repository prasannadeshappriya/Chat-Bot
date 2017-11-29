/**
 * Created by prasanna_d on 11/28/2017.
 */
//Import model classes
let apiModel = require('../models/api_model');

module.exports = {
    createAPI: async function(connectionData, callback){
        let result;
        result = await apiModel.getAllAPIs();

        //Validation
        for(let i=0; i<result.length; i++){
            let storedConnetionData = result[i].dataValues.connection_data;
            try{storedConnetionData = JSON.parse(storedConnetionData);}
            catch (err){console.log('Error parse string to json');}
            if(storedConnetionData['apiName']===connectionData['apiName']){
                return callback(false, true);
            }
        }

        //create api entry
        result = await apiModel.createAPI(JSON.stringify(connectionData));
        if (result){
            return callback(true,false);
        }else{
            return callback(false,false);
        }
    },
    getAllAPIs: async function(callback){
        let result = await apiModel.getAllAPIs();
        let response = [];
        for(let i=0; i<result.length; i++){
            response.push(result[i].dataValues);
        }
        return callback(response);
    },
    deleteAPI: async function(apiName, callback){
        let result;
        result = await apiModel.getAllAPIs();

        //Searching and delete
        for(let i=0; i<result.length; i++){
            let storedConnetionData = result[i].dataValues.connection_data;
            try{storedConnetionData = JSON.parse(storedConnetionData);}
            catch (err){console.log('Error parse string to json');}
            if(storedConnetionData['apiName']===apiName){
                try {
                    await apiModel.deleteAPI(result[i].dataValues.id);
                    return callback(true);
                }catch (err) {
                    return callback(false);
                }
            }
        }
        return callback(false);
    },
    updateAPI: async function(apiName, connectionData, callback){
        let result = await apiModel.getAllAPIs();

        //Validation
        for(let i=0; i<result.length; i++){
            let storedConnetionData = result[i].dataValues.connection_data;
            try{storedConnetionData = JSON.parse(storedConnetionData);}
            catch (err){console.log('Error parse string to json');}
            if(storedConnetionData['apiName']===apiName){
                let dbResponse = await apiModel.updateAPI(
                    result[i].dataValues.id, JSON.stringify(connectionData));
                if(dbResponse[0]>0) {
                    return callback(true);
                }else{
                    return callback(false);
                }
            }
        }
        return callback(false);
    }
};