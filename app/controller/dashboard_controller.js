/**
 * Created by prasanna_d on 8/31/2017.
 */
const entityRepository = require('../repositories/entity_repository');
const intentRepository = require('../repositories/intent_repository');

module.exports = {
    createEntity: async function(req,res){
        let entity_name = req.body.entity_name;
        let entity_data = req.body.entity_data;
        let entity_description = req.body.entity_description;
        if(typeof entity_name==='undefined' || entity_name===''){
            return res.json(400,{message: 'entity_name is required'});}
        if(typeof entity_data==='undefined' || entity_data===''){
            return res.json(400,{message: 'entity_data is required'});}
        if(typeof entity_description==='undefined' || entity_description===''){
            return res.json(400,{message: 'entity_description is required'});}
        try{
            entity_data = JSON.parse(entity_data);
        }catch (err){res.send(400,{message: 'entity_data should be in json format, parse error'});}
        try {
            let result = await entityRepository.createEntity(entity_name, entity_description, entity_data);
            if (result) {
                return res.json(201, {message: 'entity created', data: result});
            }else{
                return res.json(409,{message: 'entity already exist'});
            }
        }catch (err){return res.json(500,{message: 'internal server error'});}
    },
    updateEntity: async function(req,res){
        let entity_name = req.body.entity_name;
        let entity_value = req.body.entity_value;
        let entity_data = req.body.entity_data;
        if(typeof entity_name==='undefined' || entity_name===''){
            return res.json(400,{message: 'entity_name is required'});}
        if(typeof entity_value==='undefined' || entity_value===''){
            return res.json(400,{message: 'entity_value is required'});}
        if(typeof entity_data==='undefined' || entity_data===''){
            return res.json(400,{message: 'entity_data is required'});}
        await entityRepository.updateEntityData(
            entity_name, entity_value, entity_data,
            function (callback) {
                return res.json(201,{message: callback, method: 'update'});
            });
    },
    deleteEntityValue: async function(req,res){
        let entity_name = req.body.entity_name;
        let entity_value = req.body.entity_value;
        if(typeof entity_name==='undefined' || entity_name===''){
            return res.json(400,{message: 'entity_name is required'});}
        if(typeof entity_value==='undefined' || entity_value===''){
            return res.json(400,{message: 'entity_value is required'});}
        await entityRepository.deleteEntityValue(
            entity_name, entity_value,
            function (callback) {
                return res.json(200,{message: callback, method: 'delete'});
            });
    },
    createIntent: async function(req,res){
        let intent_name = req.body.intent_name;
        let intent_description = req.body.intent_description;
        let intent_data = req.body.intent_data;

        if(typeof intent_name==='undefined' || intent_name===''){
            return res.json(400,{message: 'intent_name is required'});
        }
        if(typeof intent_description==='undefined' || intent_description===''){
            return res.json(400,{message: 'intent_description is required'});
        }
        if(typeof intent_data==='undefined' || intent_data===''){
            return res.json(400,{message: 'intent_data is required'});
        }
        await intentRepository.createIntent(
            intent_name, intent_description, intent_data,
            function (callback) {
                if(callback[1]){return res.json(201,{message: 'intent created'});}
                else {return res.json(409, {message: 'intent already exist'});}
        });
    },
    getIntentNames: async function(req,res){
        await intentRepository.getIntentNames(function (callback) {
            return res.json(200,{data: callback});
        });
    },
    getIntent: async function(req,res){
        let intent_id = req.query.intentid;
        if(typeof intent_id==='undefined' || intent_id===''){
            return res.json(400,{message: 'intent_id is required'});
        }
        if(intent_id==='all'){
            await intentRepository.getIntentAll(function (callback) {
                return res.json(200,{data: callback});
            })
        }else{
            await intentRepository.getIntent(intent_id, function (callback) {
                return res.json(200,{data: callback});
            });
        }
    },
    updateIntent: async function(req,res){
        let intent_name = req.body.intent_name;
        let intent_data = req.body.intent_data;
        if(typeof intent_data==='undefined' || intent_data===''){
            return res.json(400,{message: 'intent_data is required'});
        }
        if(typeof intent_name==='undefined' || intent_name===''){
            return res.json(400,{message: 'intent_name is required'});
        }
        await intentRepository.updateIntent(
            intent_name, intent_data,
            function (callback) {
                return res.json(200,{data: callback});
        });
    },
    deleteIntent: async function(req,res){
        let intent_name = req.body.intent_name;
        if(typeof intent_name==='undefined' || intent_name===''){
            return res.json(400,{message: 'intent_name is required'});
        }
        await intentRepository.deleteIntent(intent_name, function (callback) {
            if(callback[0]){
                return res.json(200,{message: 'intent, \'' + intent_name + '\' deleted' });
            }else{return res.json(400,{message: 'no intent found by \'' + intent_name + '\''});}
        });
    },
    createOrUpdateEntityValue: async function(req,res){
        let entity_name = req.body.entity_name;
        let entity_value = req.body.entity_value;
        let entity_data = req.body.entity_data;
        if(typeof entity_name==='undefined' || entity_name===''){
            return res.json(400,{message: 'entity_name is required'});}
        if(typeof entity_value==='undefined' || entity_value===''){
            return res.json(400,{message: 'entity_value is required'});}
        if(typeof entity_data==='undefined' || entity_data===''){
            return res.json(400,{message: 'entity_data is required'});}
        await entityRepository.updateOrCreateEntityValue(
            entity_name, entity_value, entity_data,
            function (callback) {
                return res.json(200,{message: callback});
        });
    },
    getEntityData: async function(req,res){
        let entity_name = req.query.entity_name;
        let entity_value = req.query.entity_value;
        if(typeof entity_name==='undefined'){entity_name = '';}
        if(typeof entity_value==='undefined'){entity_value = '';}
        await entityRepository.getEntityData(
            entity_name, entity_value,
            function (callback, entity_value) {
                if(callback) {
                    if(!entity_value){return res.json(200, {message: callback, entity_data: ''});}
                    if(typeof entity_value.data!=='undefined') {
                        return res.json(200, {message: callback, entity_data: entity_value.data});
                    }else{return res.json(200, {message: callback, entity_data: ''});}
                }else{return res.json(200, {message: callback, entity_data: ''});}
        });
    }
};