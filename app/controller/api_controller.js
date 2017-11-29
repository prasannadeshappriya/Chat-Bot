/**
 * Created by prasanna_d on 11/28/2017.
 */
//Import repository classes
let apiRepository = require('../repositories/api_repository');

module.exports = {
    createAPI: async function(req,res){
        if(typeof req.body==='undefined'){
            return res.json(400,{message: 'body data is required'});}
        if(typeof req.body.connection_data==='undefined' ||
                req.body.connection_data===''){
            return res.json(400,{message: 'Connection data is required'});
        }
        let connectionData = req.body.connection_data;
        let data;
        try{
            try{data = JSON.parse(connectionData);}
            catch (err){data = connectionData;}
        }catch (err){
            return res.json(400,{message: 'Data is not in JSON format'});
        }

        try{
            await apiRepository.createAPI(data, async function (status, isDuplicate) {
                if(isDuplicate){
                    return res.json(409,{message: 'Cannot create API with the same name'});}
                if(status){
                    return res.json(201,{message: 'API created successfully'});
                }else{
                    return res.json(500,{message: 'Something went wrong!, Try again.'});}
            })
        }catch (err){
            return res.json(500,{message: 'Something went wrong!, Try again.'});
        }
    },
    getAllAPIs: async function(req, res){
        try{
            await apiRepository.getAllAPIs(async function (data) {
                return res.json(200,{data: data});
            })
        }catch (err){
            return res.json(500,{message: 'Something went wrong!, Try again.'});
        }
    }
};