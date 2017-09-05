/**
 * Created by prasanna_d on 9/4/2017.
 */
let http = require('http');
var request = require('request');

module.exports = {
    getEntityById: async function(req,res){
        let entity_name = req.query.entity_name;
        if(typeof entity_name==='undefined' || entity_name===''){
            return res.json(400,{message: 'entity_id is required'});
        }
        let url = 'https://api.wit.ai/entities/' + entity_name + '?v=20170307';
        request({
            method: 'GET',
            url: url,
            headers: {
                'Authorization': 'Bearer 6PN2II4QPW5UYG3VPR6EXWFRU6MTTFBH',
                'Content-Type': 'application/json'
            }
        }, function (err, wit_res) {
            if (err) {return res.json(500,{message: 'Internal sever error'});}
            return res.json(200,{data: wit_res.body});
        });
    }
};