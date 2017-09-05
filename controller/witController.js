/**
 * Created by prasanna_d on 9/4/2017.
 */
const request = require('request');
const wit_content_type = 'application/json';

function print_request(route){
    let url_domain = 'http://localhost:3000';
    console.log(url_domain + '/wit' + route);
}

function getWitServerAccessToken(){
    let token = '6PN2II4QPW5UYG3VPR6EXWFRU6MTTFBH';
    return 'Bearer ' + token;
}

module.exports = {
    getEntityById: async function(req,res){
        print_request('getEntityById');
        let entity_name = req.query.entity_name;
        if(typeof entity_name==='undefined' || entity_name===''){
            return res.json(400,{message: 'entity_name is required'});}
        let url = 'https://api.wit.ai/entities/' + entity_name + '?v=20170307';
        request({
            method: 'GET', url: url,
            headers: {
                'Authorization': getWitServerAccessToken(), 'Content-Type': wit_content_type
            }
        }, function (err, wit_res) {
            if (err) {return res.json(500,{message: 'Internal sever error'});}
            return res.json(200,{data: JSON.parse(wit_res.body)});
        });
    },
    putEntityById: async function(req,res){
        print_request('putEntityById');
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
                'Authorization': getWitServerAccessToken(), 'Content-Type': wit_content_type
            }
        }, function (err, wit_res) {
            if (err) {return res.json(500,{message: 'Internal sever error'});}
            return res.json(200,{data: wit_res.body});
        });
    },
    postEntity: async function(req,res){
        print_request('postEntity');
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
        if(typeof wit_values==='undefined' || wit_values===''){
            return res.json(400,{message: 'wit_values is required'});}
        let url = 'https://api.wit.ai/entities?v=20170307';
        try{
            wit_values = JSON.parse(wit_values);
            wit_lookups = JSON.parse(wit_lookups);
        }catch (err){
            return res.json(400,{
                message: 'wit_values/wit_lookups should be in JSON format, JSON.parse error',
                error: err
            });
        }
        let body = {"doc": wit_doc, "id": wit_id, "lookups": [wit_lookups], "values": wit_values};
        request({
            method: 'POST', url: url,
            json: body,
            headers: {
                'Authorization': getWitServerAccessToken(), 'Content-Type': wit_content_type
            }
        }, function (err, wit_res) {
            if (err) {return res.json(500,{message: 'Internal sever error'});}
            return res.json(200,{data: wit_res.body});
        });
    }
};