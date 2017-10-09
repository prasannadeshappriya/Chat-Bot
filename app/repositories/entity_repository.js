/**
 * Created by prasanna on 9/16/17.
 */
let models = require('../database/models');
const entityModel = require('../models/entity_model');
const entityDataModel = require('../models/entity_data_model');

module.exports = {
    getAllEntities: async function(callback){
        let result = await entityModel.getAllEntities();
        callback(result);
    },
    getEntityByName: async function(name, callback){
        let result = await entityModel.getEntityByName(name);
        callback(result);
    },
    getEntityData: async function(name, value, callback){
        let result = await entityModel.getEntityByName(name);
        if(result) {
            let entity_id = result.dataValues.id;
            if(value){
                result = await entityDataModel.getEntityData(entity_id,value);
                return callback(true, result);
            }else{
                result = await entityDataModel.getAllEntityData(entity_id);
                return callback(true, result);
            }
        }
        return callback(false, null);
    },
    updateOrCreateEntityValue: async function(entity_name, entity_value, entity_data, callback){
        let result = await entityModel.getEntityByName(entity_name);
        if(result){
            let entity_id = result.dataValues.id;
            result = await entityDataModel.updateEntityData(
                entity_id, entity_value, entity_data
            );
            if(result[0]===0){
                result = await entityDataModel.createEntityData(
                    entity_id, entity_value, entity_data
                );
            }
            return callback(true);
        }else{
            result = await entityModel.createEntity(entity_name);
            console.log(result);
            let entity_id = result.dataValues.id;
            result = await entityDataModel.createEntityData(
                entity_id, entity_value, entity_data
            );
            return callback(true);
        }
    },
    deleteEntity: async function(entity_name, callback){
        let result = await entityModel.getEntityByName(entity_name);
        if(result){
            let entity_id = result.dataValues.id;
            result = await entityDataModel.deleteAllEntityData(entity_id);
            return callback(true);
        }
        callback(false);
    },
    getEntityValues: async function(name, callback){
        let con = true;
        if(name.length>3){
            if(name.substr(0,4)==='wit$'){
                con = false;
                let result = await entityModel.getEntityByName(
                    name.substr(4, name.length));
                if (result) {
                    let entity_id = result.dataValues.id;
                    result = await entityDataModel.getAllEntityData(entity_id);
                    let ret = [];
                    for (let i = 0; i < result.length; i++) {
                        ret.push(result[i].dataValues);
                    }
                    return callback(ret);
                }else{return callback([]);}
            }
        }
        if(con) {
            let result = await entityModel.getEntityByName(name);
            if (result) {
                let entity_id = result.dataValues.id;
                result = await entityDataModel.getAllEntityData(entity_id);
                let ret = [];
                for (let i = 0; i < result.length; i++) {
                    ret.push(result[i].dataValues);
                }
                return callback(ret);
            }
        }
        return callback(result);
    },
    createEntity: async function(entity_name, entity_description, entity_data){
        let db_response = await entityModel.findOrCreateEntity(
            entity_name, entity_description
        );
        if(db_response[1]) {
            let entity_id = db_response[0].dataValues.id;
            let entity_values = [];
            try {
                for (let i = 0; i < entity_data.length; i++) {
                    let item = entity_data[i];
                    let tmp_obj = {entity_id: entity_id, value: item.value, data: item.data};
                    entity_values.push(tmp_obj)
                }
                await entityDataModel.bulkCreateEntityData(entity_values);
                return true;
            } catch (err) {
                console.log(err); //Display error message
                return false;
            }
        }else {return false;}
    },
    bulkCreateEntity: async function(entity_values,callback){
        let result;
        if (entity_values.length > 0) {
            result = await entityDataModel.bulkCreateEntityData(entity_values);
            callback(result);
        }
        callback(result);
    },
    updateEntityData: async function(name,value,data,callback){
        let result = await entityModel.getEntityByName(name);
        if(result){
            let entity_id = result.dataValues.id;
            result = await entityDataModel.updateEntityData(
                entity_id, value, data);
            if(result[0]===0){
                result = await entityDataModel.createEntityData(
                    entity_id, value, data
                );
            }return callback(result);
        }return callback(result);
    },
    deleteEntityValue: async function(name,value,callback){
        let result = await entityModel.getEntityByName(name);
        if(result){
            let entity_id = result.dataValues.id;
            result = await entityDataModel.deleteEntityData(
                entity_id, value
            );
            return callback(result);
        }
        return callback(result);
    }
};