/**
 * Created by prasanna_d on 8/31/2017.
 */
const models = require('../database/models');

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
        let db_response = await models.entity.findOrCreate({
            where: {
                name: entity_name
            },
            defaults: {
                name: entity_name,
                entity_dis: entity_data,
                description: entity_description
            }
        });
        if(db_response[1]){
            return res.json(201,{message: 'entity created'});
        }
        return res.json(409,{message: 'entity already exist'});
    },
    getEntity: async function(req,res){
        let entity_id = req.query.entityid;
        if(typeof entity_id==='undefined' || entity_id===''){
            return res.json(400,{message: 'entity_id is required'});
        }
        let resData = [];   //Return Data
        let entities = await models.entity.findAll();
        try {
            Object.keys(entities).forEach(function (key) {
                resData.push({
                    id: entities[key].dataValues.intent_id,
                    name: entities[key].dataValues.name,
                    description: entities[key].dataValues.description,
                });
            });
            for(let i=0; i<resData.length; i++){
                let intent = await models.intent.findOne({
                    where: {id: resData[i].id}
                });
                if(intent) {resData[i]['intent_name'] = intent.dataValues.name;}
                else{resData[i]['intent_name'] = 'Error_Intent';}
            }
            return res.json(200, {data: resData});
        }catch (err){
            return res.json(500, {message: 'internal server error'});
        }
    },
    createIntent: async function(req,res){
        let intent_name = req.body.intent_name;
        let intent_description = req.body.intent_description;

        if(typeof intent_name==='undefined' || intent_name===''){
            return res.json(400,{message: 'intent_name is required'});
        }
        if(typeof intent_description==='undefined' || intent_description===''){
            return res.json(400,{message: 'intent_description is required'});
        }
        let db_response = await models.intent.findOrCreate({
            where: {
                name: intent_name
            },
            defaults: {
                name: intent_name,
                description: intent_description
            }
        });
        if(db_response[1]){
            return res.json(201,{message: 'intent created'});
        }
        return res.json(409,{message: 'intent already exist'});
    },
    getIntent: async function(req,res){
        let intent_id = req.query.intentid;
        if(typeof intent_id==='undefined' || intent_id===''){
            return res.json(400,{message: 'intent_id is required'});
        }
        if(intent_id==='all'){
            let resData = [];   //Return Data
            let intents = await models.intent.findAll();
            Object.keys(intents)
                .forEach(function (key) {
                    resData.push({
                        name: intents[key].dataValues.name,
                        description: intents[key].dataValues.description,
                    });
                });
            return res.json(200,{data: resData});
        }else{
            return res.send(501).json({message: 'This section is not implemented'});
        }
    },
    deleteIntent: async function(req,res){
        let intent_name = req.body.intent_name;
        if(typeof intent_name==='undefined' || intent_name===''){
            return res.json(400,{message: 'intent_name is required'});
        }
        let result = await models.intent.destroy({
            where: {name: intent_name}
        });
        if(result){
            return res.json(200,{message: 'intent, \'' + intent_name + '\' deleted' });
        }
        return res.json(400,{message: 'no intent found by \'' + intent_name + '\''});
    }
};