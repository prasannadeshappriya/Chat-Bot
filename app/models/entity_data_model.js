/**
 * Created by prasanna_d on 9/20/2017.
 */
let model = require('../database/models');

module.exports = {
    getEntityData: async function (entity_id, value) {
        try {
            return await model.entity_data.findOne({
                where: {entity_id: entity_id, value: value}
            });
        } catch (err) {
            console.log(err); //Display error message
            return null;
        }
    },
    getAllEntityData: async function(entity_id){
        try{
            return await model.entity_data.findAll({
                where: {entity_id: entity_id}
            });
        } catch (err) {
            console.log(err); //Display error message
            return null;
        }
    },
    updateEntityData: async function(entity_id, entity_value, entity_data){
        try{
            return await model.entity_data.update(
                {data: entity_data},
                {where:{value: entity_value, entity_id: entity_id}}
            );
        } catch (err) {
            console.log(err); //Display error message
            return null;
        }
    },
    updateEntityDataById: async function(entity_id, entity_value, entity_data,old_value){
        try{
            return await model.entity_data.update(
                {data: entity_data},
                {where:{entity_id: entity_id, data: old_value}}
            );
        } catch (err) {
            console.log(err); //Display error message
            return null;
        }
    },
    createEntityData: async function(entity_id, entity_value, entity_data){
        try{
            return await model.entity_data.create({
                entity_id: entity_id,
                value: entity_value,
                data: entity_data
            });
        } catch (err) {
            console.log(err); //Display error message
            return null;
        }
    },
    deleteAllEntityData: async function(entity_id){
        try{
            return await model.entity_data.destroy({
                where: {entity_id: entity_id}
            });
        } catch (err) {
            console.log(err); //Display error message
            return null;
        }
    },
    deleteEntityDataByPreviousValue: async function(entity_id, entity_value, previous_value){
        try{
            return await model.entity_data.destroy({
                where: {value: entity_value, entity_id:  entity_id, data:previous_value}
            });
        } catch (err) {
            console.log(err); //Display error message
            return null;
        }
    },
    deleteEntityData: async function(entity_id, entity_value){
        try{
            return await model.entity_data.destroy({
                where: {value: entity_value, entity_id:  entity_id}
            });
        } catch (err) {
            console.log(err); //Display error message
            return null;
        }
    },
    bulkCreateEntityData: async function(entity_values){
        try {
            return await model.entity_data.bulkCreate(entity_values);
        }catch (err){
            console.log(err); //Display error message
            return null;
        }
    },
    findOrCreateEntityData: async function(entity_id, name, data){
        try {
            return await model.entity_data.findOrCreate({
                where: {
                    entity_id: entity_id,
                    value: name
                },
                defaults: {
                    entity_id: entity_id,
                    value: name,
                    data: data
                }
            });
        }catch (err){
            console.log(err); //Display error message
            return null;
        }
    }
};