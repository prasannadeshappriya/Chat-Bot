/**
 * Created by prasanna_d on 9/4/2017.
 */
let request = require('request');

function print_request(route){
    let url_domain = 'http://localhost:3000';
    console.log(url_domain + '/wit' + route);
}

module.exports = {
    getEntityById: async function(req,res){
        print_request('getEntityById');
        let entity_name = req.query.entity_name;
        let wit_token = req.headers.authorization;
        let wit_content_type = req.headers.content_type;
        if(typeof entity_name==='undefined' || entity_name===''){
            return res.json(400,{message: 'entity_name is required'});}
        if(typeof wit_token==='undefined' || wit_token===''){
            return res.json(400,{message: 'Authorization header is required'});}
        if(typeof wit_content_type==='undefined' || wit_content_type===''){
            return res.json(400,{message: 'content_type header is required'});}
        let url = 'https://api.wit.ai/entities/' + entity_name + '?v=20170307';
        request({
            method: 'GET', url: url,
            headers: {
                'Authorization': wit_token, 'Content-Type': wit_content_type
            }
        }, function (err, wit_res) {
            if (err) {return res.json(500,{message: 'Internal sever error'});}
            return res.json(200,{data: JSON.parse(wit_res.body)});
        });
    },
    putEntityById: async function(req,res){
        print_request('putEntityById');
        let entity_name = req.body.entity_name;
        let wit_token = req.headers.authorization;
        let wit_content_type = req.headers.content_type;
        let wit_doc = req.body.wit_doc;
        let wit_values = req.body.wit_values;
        if(typeof entity_name==='undefined' || entity_name===''){
            return res.json(400,{message: 'entity_name is required'});}
        if(typeof wit_values==='undefined' || wit_values===''){
            return res.json(400,{message: 'wit_values is required'});}
        if(typeof wit_doc==='undefined' || wit_doc===''){
            return res.json(400,{message: 'wit_doc is required'});}
        if(typeof wit_token==='undefined' || wit_token===''){
            return res.json(400,{message: 'Authorization header is required'});}
        if(typeof wit_content_type==='undefined' || wit_content_type===''){
            return res.json(400,{message: 'content_type header is required'});}
        let url = 'https://api.wit.ai/entities/' + entity_name + '?v=20170307';
        try{
            wit_values = JSON.parse(wit_values);
        }catch (err){
            return res.json(400,{message: 'wit_values should be in JSON format'});
        }
        let body = {"doc": wit_doc, "values": wit_values};
        request({
            method: 'PUT', url: url,
            json: body,
            headers: {
                'Authorization': wit_token, 'Content-Type': wit_content_type
            }
        }, function (err, wit_res) {
            if (err) {return res.json(500,{message: 'Internal sever error'});}
            return res.json(200,{data: wit_res.body});
        });
    }
};