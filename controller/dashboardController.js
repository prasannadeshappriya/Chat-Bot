/**
 * Created by prasanna_d on 8/31/2017.
 */
const entity_repo = require('../repositories/entityRepo');
const intent_repo = require('../repositories/intentRepo');

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
            entity_repo.createEntity(entity_name, entity_description, function (callback) {
                if (callback[1]) {
                    let entity_id = callback[0].dataValues.id;
                    let entity_values = [];
                    try {
                        for (let i = 0; i < entity_data.length; i++) {
                            let item = entity_data[i];
                            let tmp_obj = {entity_id: entity_id, value: item.value, data: item.data};
                            entity_values.push(tmp_obj)
                        }
                        entity_repo.bulkCreateEntity(entity_values,function (callback) {
                            return res.json(201,{message: 'entity created', data: callback});
                        });
                    }catch (err){return res.json(500,{message: 'internal server error'});}
                } else{return res.json(409,{message: 'entity already exist'});}
            });
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
        entity_repo.updateEntityData(
            entity_name,
            entity_value,
            entity_data,
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
        entity_repo.deleteEntityValue(
            entity_name,
            entity_value,
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
        intent_repo.createIntent(intent_name,intent_description, intent_data,function (callback) {
            if(callback[1]){
                return res.json(201,{message: 'intent created'});
            }else {
                return res.json(409, {message: 'intent already exist'});
            }
        });
    },
    getIntent: async function(req,res){
        let intent_id = req.query.intentid;
        if(typeof intent_id==='undefined' || intent_id===''){
            return res.json(400,{message: 'intent_id is required'});
        }
        if(intent_id==='all'){
            let resData = [];   //Return Data
            intent_repo.getIntentAll(function (callback) {
                Object.keys(callback)
                    .forEach(function (key) {
                        resData.push({
                            name: callback[key].dataValues.name,
                            description: callback[key].dataValues.description,
                        });
                    });
                return res.json(200,{data: resData});
            })
        }else{
            intent_repo.getIntent(intent_id, function (callback) {
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
        await intent_repo.updateIntent(intent_name,intent_data,function (callback) {
            return res.json(200,{data: callback});
        });
    },
    deleteIntent: async function(req,res){
        let intent_name = req.body.intent_name;
        if(typeof intent_name==='undefined' || intent_name===''){
            return res.json(400,{message: 'intent_name is required'});
        }
        intent_repo.deleteIntent(intent_name,function (callback) {
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
            return res.json(400,{message: 'entity_name is required'});
        }
        if(typeof entity_value==='undefined' || entity_value===''){
            return res.json(400,{message: 'entity_value is required'});
        }
        if(typeof entity_data==='undefined' || entity_data===''){
            return res.json(400,{message: 'entity_data is required'});
        }
        entity_repo.updateOrCreateEntityValue(entity_name, entity_value, entity_data, function (callback) {
            return res.json(200,{message: callback});
        });
    },
    getEntityData: async function(req,res){
        let entity_name = req.query.entity_name;
        let entity_value = req.query.entity_value;
        if(typeof entity_name==='undefined'){entity_name = '';}
        if(typeof entity_value==='undefined'){entity_value = '';}
        entity_repo.getEntityData(entity_name, entity_value, function (callback, entity_value) {
            if(callback) {
                if(!entity_value){return res.json(200, {message: callback, entity_data: ''});}
                if(typeof entity_value.data!=='undefined') {
                    return res.json(200, {message: callback, entity_data: entity_value.data});
                }else{return res.json(200, {message: callback, entity_data: ''});}
            }else{return res.json(200, {message: callback, entity_data: ''});}
        });
    }
};