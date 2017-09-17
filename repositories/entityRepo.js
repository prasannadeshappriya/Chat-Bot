/**
 * Created by prasanna on 9/16/17.
 */
let models = require('../database/models');
module.exports = {
    getAllEntities: async function(callback){
        let result = await models.entity.findAll();
        callback(result);
    },
    getEntitybyName: async function(name, callback){
        let result = await models.entity.findOne({
            where:{name: name}
        });
        callback(result);
    },
    deleteEntity: async function(entity_name, callback){
        let result = await models.entity.findOne({
            where:{name: entity_name}
        });
        if(result){
            let entity_id = result.dataValues.id;
            result = await models.entity_data.destroy({
                where: {entity_id: entity_id}
            });
            result = await models.entity.destroy({
                where: {name: entity_name}
            });
            return callback(true);
        }
        callback(false);
    },
    getEntityValues: async function(name, callback){
        let result = await models.entity.findOne({
            where:{name: name}
        });
        if(result){
            let entity_id = result.dataValues.id;
            result = await models.entity_data.findAll({
                where:{entity_id: entity_id}
            });
            let ret = [];
            for(let i=0; i<result.length; i++){ret.push(result[i].dataValues);}
            return callback(ret);
        }
        return callback(result);
    },
    createEntity: async function(entity_name,entity_description,callback){
        let db_response = await models.entity.findOrCreate({
            where: {
                name: entity_name
            },
            defaults: {
                name: entity_name,
                description: entity_description
            }
        });
        callback(db_response);
    },
    bulkCreateEntity: async function(entity_values,callback){
        let result;
        if (entity_values.length > 0) {
            result = await models.entity_data.bulkCreate(entity_values);
            callback(result);
        }
        callback(result);
    },
    updateEntityData: async function(name,value,data,callback){
        let result = await models.entity.findOne({
            where:{name: name}
        });
        if(result){
            let entity_id = result.dataValues.id;
            result = await models.entity_data.update(
                {data: data},
                {where:{value: value, entity_id: entity_id}}
            );
            if(result[0]===0){
                result = await models.entity_data.create({
                    entity_id: entity_id,
                    value: value,
                    data: data
                });
            }
            return callback(result);
        }
        return callback(result);
    },
    deleteEntityValue: async function(name,value,callback){
        let result = await models.entity.findOne({
            where:{name: name}
        });
        if(result){
            let entity_id = result.dataValues.id;
            result = await models.entity_data.destroy({
                where: {value: value, entity_id:  entity_id}
            });
            return callback(result);
        }
        return callback(result);
    }
};