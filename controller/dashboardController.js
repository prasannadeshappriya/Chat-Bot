/**
 * Created by prasanna_d on 8/31/2017.
 */
const models = require('../database/models');

module.exports = {
    createEntity: async function(req,res){
        let entity_name = req.body.entity_name;
        let intent_id = req.body.intent_id;
        let entity_description = req.body.entity_description;
        let data = {
            entity_name: entity_name,
            intent_id: intent_id,
            entity_description: entity_description
        };
        console.log(data);
        return res.json({message: 'success'});
    },

    getEntity: async function(req,res){
        let entity_id = req.query.entityid;
        console.log(entity_id);
        return res.json({message: 'success'});
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