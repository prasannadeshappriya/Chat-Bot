/**
 * Created by prasanna_d on 9/19/2017.
 */
let model = require('../database/models');

module.exports = {
    getAllEntities: async function(){
        try {
            return await model.entity.findAll();
        }catch (err){
            console.log(err); //Display error message
            return null;
        }
    },
    getEntityByName: async function(name){
        try {
            return await model.entity.findOne({
                where:{name: name}
            });
        }catch (err){
            console.log(err); //Display error message
            return null;
        }
    },
    createEntity: async function(entity_name){
        try {
            return await model.entity.create({
                name: entity_name,
                description: 'User-defined entity'
            });
        }catch (err){
            console.log(err); //Display error message
            return null;
        }
    },
    findOrCreateEntity: async function(entity_name, entity_description){
        try {
            return await model.entity.findOrCreate({
                where: {
                    name: entity_name
                },
                defaults: {
                    name: entity_name,
                    description: entity_description
                }
            });
        }catch (err){
            console.log(err); //Display error message
            return null;
        }
    }
};