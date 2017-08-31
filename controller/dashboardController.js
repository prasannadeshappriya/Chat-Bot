/**
 * Created by prasanna_d on 8/31/2017.
 */
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
        console.log('asdasdasd');
        console.log(req.body);
        let intent_name = req.body.intent_name;
        let intent_description = req.body.intent_description;
        let data = {
            intent_name: intent_name,
            intent_description: intent_description
        };
        console.log(data);
        return res.json({message: 'success'});
    },
    getIntent: async function(req,res){
        let intent_id = req.query.intentid;
        console.log(intent_id);
        return res.json({message: 'success'});
    },
};