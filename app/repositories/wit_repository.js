/**
 * Created by prasanna_d on 9/21/2017.
 */
//Models
const settingsModel = require('../models/settings_model');
const entityModel = require('../models/entity_model');
const entityDataModel = require('../models/entity_data_model');

module.exports = {
    getWitServerAccessToken: async function(){
        let result = await settingsModel.getAll();
        return 'Bearer ' + result[0].dataValues.token;
    },
    deleteWitData: async function(wit_Data){
        let entity_name = wit_Data.entityName;
        let entity_value = wit_Data.value;
        let old_value = wit_Data.oldItemWitData;
        if(typeof old_value==='undefined' ||
            old_value===''){return [false,'old_value is required for delete entity value'];}
        if(typeof entity_value==='undefined' ||
            entity_value===''){return [false,'entity_value is required for delete entity value'];}
        if(typeof entity_name==='undefined' ||
            entity_name===''){return [false,'entity_name is required for delete entity value'];}
        let result = await entityModel.getEntityByName(entity_name);
        if(result) {
            let entity_id = result.dataValues.id;
            result = await entityDataModel.deleteEntityDataByPreviousValue(
                entity_id,entity_value,old_value);
            return [true,result];
        }else{return [false,'entity_name, \'' + entity_name + '\' is not found'];}
    },
    updateWitData: async function(wit_data){
        let entity_name = wit_data.entityName;
        let entity_value = wit_data.value;
        let entity_data = wit_data.data;
        if(typeof wit_data.isNew==='undefined'){
            return [false,'isNew is required for new entity'];}
        if(typeof entity_name==='undefined' ||
            entity_name===''){return [false,'entity_name is required for new entity'];}
        if(wit_data.isNew){
            let result = await entityModel.getEntityByName(entity_name);
            if(result) {
                let entity_id = result.dataValues.id;
                result = await entityDataModel.createEntityData(
                    entity_id,entity_value,entity_data);
                return [true,result];
            }else{return [false,'entity_name, \'' + entity_name + '\' is not found'];}
        }else {
            let result = await entityModel.getEntityByName(entity_name);
            if(result) {
                let entity_id = result.dataValues.id;
                let old_value = wit_data.oldItemWitData;
                if(typeof old_value==='undefined' ||
                    old_value===''){return 'old_value is required for update';}
                result = await entityDataModel.updateEntityDataById(
                    entity_id,entity_name,entity_data,old_value
                );
                return [true,result];
            }else{return [false,'entity_name, \'' + entity_name + '\' is not found'];}
        }
    }
};