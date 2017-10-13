/**
 * Created by prasanna_d on 9/4/2017.
 */
const request = require('request');
//Repositories
const entityRepository = require('../repositories/entity_repository');
const witRepository = require('../repositories/wit_repository');

//App constants
const wit_content_type = 'application/json';

module.exports = {
    deleteWitData: async function(req, res){
        let entity_data = req.body.entity_data;
        if(typeof entity_data==='undefined' || entity_data===''){
            return res.json(400,{message: 'entity_data is required'});}
        try{entity_data = JSON.parse(entity_data)}
        catch (err){return res.json(400,{message: 'entity_data should be a json string'});}
        let result = await witRepository.deleteWitData(entity_data);
        if(result[0]){return res.json(200,{message: result[1]});}
        else{return res.json(400,{message: result[1]});}
    },
    updateWitData: async function(req,res){
        let entity_data = req.body.entity_data;
        if(typeof entity_data==='undefined' || entity_data===''){
            return res.json(400,{message: 'entity_data is required'});}
        try{entity_data = JSON.parse(entity_data)}
        catch (err){return res.json(400,{message: 'entity_data should be a json string'});}
        let result = await witRepository.updateWitData(entity_data);
        if(result[0]){return res.json(200,{message: result[1]});}
        else{return res.json(400,{message: result[1]});}
    },
    getEntities: async function(req,res){
        let url = 'https://api.wit.ai/entities?v=20170307';
        request({
            method: 'GET', url: url,
            headers: {
                'Authorization': await witRepository.getWitServerAccessToken(), 'Content-Type': wit_content_type
            }
        }, function (err, wit_res) {
            if (err) {return res.json(500,{message: err});}
            return res.json(200,{data: JSON.parse(wit_res.body)});
        });
    },
    deleteEntity: async function(req,res) {
        let entity_name = req.body.entity_name;
        if(typeof entity_name==='undefined' || entity_name===''){
            return res.json(400,{message: 'entity_name is required'});}
        let url = 'https://api.wit.ai/entities/'+ entity_name +'?v=20170307';
        request({
            method: 'DELETE', url: url,
            headers: {
                'Authorization': await witRepository.getWitServerAccessToken(), 'Content-Type': wit_content_type
            }
        }, async function (err, wit_res) {
            if (err) {return res.json(500,{message: 'Internal sever error'});}
            await entityRepository.deleteEntity(entity_name,function (result) {
                return res.json(200,{data: JSON.parse(wit_res.body), message: result});
            });
        });
    },
    getEntityById: async function(req,res){
        let entity_name = req.query.entity_name;
        if(typeof entity_name==='undefined' || entity_name===''){
            return res.json(400,{message: 'entity_name is required'});}
        let url = 'https://api.wit.ai/entities/' + entity_name + '?v=20170307';
        request({
            method: 'GET', url: url,
            headers: {
                'Authorization': await witRepository.getWitServerAccessToken(), 'Content-Type': wit_content_type
            }
        }, async function (err, wit_res) {
            if (err) {return res.json(500,{message: 'Internal sever error'});}
            await entityRepository.getEntityValues(entity_name,function (result) {
                return res.json(200,{data: JSON.parse(wit_res.body), values: result});
            });
        });

    },
    putEntityById: async function(req,res){
        let entity_name = req.body.entity_name;
        let wit_doc = req.body.wit_doc;
        let wit_values = req.body.wit_values;
        if(typeof entity_name==='undefined' || entity_name===''){
            return res.json(400,{message: 'entity_name is required'});}
        if(typeof wit_values==='undefined' || wit_values===''){
            return res.json(400,{message: 'wit_values is required'});}
        if(typeof wit_doc==='undefined' || wit_doc===''){
            return res.json(400,{message: 'wit_doc is required'});}
        let url = 'https://api.wit.ai/entities/' + entity_name + '?v=20170307';
        try{
            wit_values = JSON.parse(wit_values);
        }catch (err){
            return res.json(400,{message: 'wit_values should be in JSON format, JSON.parse error'});
        }
        let body = {"doc": wit_doc, "values": wit_values};
        request({
            method: 'PUT', url: url,
            json: body,
            headers: {
                'Authorization': await witRepository.getWitServerAccessToken(), 'Content-Type': wit_content_type
            }
        }, function (err, wit_res) {
            if (err) {return res.json(500,{message: 'Internal sever error'});}
            return res.json(200,{data: wit_res.body});
        });
    },
    postEntity: async function(req,res){
        let wit_doc = req.body.doc;
        let wit_id = req.body.id;
        let wit_lookups = req.body.lookups;
        let wit_values = req.body.values;
        if(typeof wit_doc==='undefined' || wit_doc===''){
            return res.json(400,{message: 'wit_doc is required'});}
        if(typeof wit_id==='undefined' || wit_id===''){
            return res.json(400,{message: 'wit_id is required'});}
        if(typeof wit_lookups==='undefined' || wit_lookups===''){
            return res.json(400,{message: 'wit_lookups is required'});}
        let url = 'https://api.wit.ai/entities?v=20170307';
        let body;
        try{
            wit_lookups = JSON.parse(wit_lookups);
        }catch (err){
            return res.json(400,{
                message: 'wit_lookups should be in JSON format, JSON.parse error',
                error: err
            });
        }
        if(typeof wit_values==='undefined' || wit_values===''){
            try{
                body = {"doc": wit_doc, "id": wit_id, "lookups": [wit_lookups]};
            }catch (err){
                return res.json(400,{
                    message: 'wit_values should be in JSON format, JSON.parse error',
                    error: err
                });
            }
        }else{
            try{
                wit_values = JSON.parse(wit_values);
                body = {"doc": wit_doc, "id": wit_id, "lookups": [wit_lookups], "values": wit_values};
            }catch (err){
                return res.json(400,{
                    message: 'wit_values/wit_lookups should be in JSON format, JSON.parse error',
                    error: err
                });
            }
        }
        request({
            method: 'POST', url: url,
            json: body,
            headers: {
                'Authorization': await witRepository.getWitServerAccessToken(), 'Content-Type': wit_content_type
            }
        }, function (err, wit_res) {
            console.log(wit_res.body);
            if (err) {return res.json(500,{message: 'Internal sever error'});}
            return res.json(200,{data: wit_res.body});
        });
    },
    getMessage: async function(req,res){
        let message = req.query.message;
        if(typeof message==='undefined' || message===''){
            return res.json(400,{message: 'message is required'});}
        message = message.replace(" ","%20");
        let url = 'https://api.wit.ai/message?v=20170307&q=' + message;
        request({
            method: 'GET', url: url,
            headers: {
                'Authorization': await witRepository.getWitServerAccessToken(), 'Content-Type': wit_content_type
            }
        }, function (err, wit_res) {
            if (err) {return res.json(500,{message: 'Internal sever error'});}
            return res.json(200,{data: JSON.parse(wit_res.body)});
        });
    },
    postSample: async function(req,res){
        let text = req.body.text;
        let entities = req.body.entities;
        if(typeof text==='undefined' || text===''){
            return res.json(400,{message: 'text is required'});}
        if(typeof entities==='undefined' || entities===''){
            return res.json(400,{message: 'entities is required'});}
        let url = 'https://api.wit.ai/samples?verbose=true&v=20170307';
        try{
            entities = JSON.parse(entities);
        }catch (err){
            return res.json(400,{
                message: 'entities should be in JSON format, JSON.parse error',
                error: err
            });
        }
        let body = [{"text": text, "entities": entities}];
        request({
            method: 'POST', url: url,
            json: body,
            headers: {
                'Authorization': await witRepository.getWitServerAccessToken(), 'Content-Type': wit_content_type
            }
        }, function (err, wit_res) {
            if (err) {return res.json(500,{message: 'Internal sever error'});}
            return res.json(wit_res.statusCode,{data: wit_res.body});
        });
    }
};