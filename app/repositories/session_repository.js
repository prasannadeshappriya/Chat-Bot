/**
 * Created by prasanna_d on 9/20/2017.
 */
let sessionModel = require('../models/session_model');

module.exports = {
    getSession: async function(fbid){
        try {
            let result = await sessionModel.getSession(fbid);
            if(result){return [true,result];}
            else{return [false,null];}
        }catch (err){
            return[false, null];
        }
    },
    getAllSessions: async function(){
        try {
            let result = await sessionModel.getAllSessions();
            if(result){return [true,result];}
            else{return [false,null];}
        }catch (err){
            return[false, null];
        }
    },
    createOrUpdateSession: async function(fbid, session_data){
        let result = await this.getSession(fbid);
        try {
            if (result[0]) {
                let response = await sessionModel.updateSession();
                return [true, response];
            } else {
                let response = await sessionModel.createSession(fbid, session_data);
                return [true, response];
            }
        }catch (err){
            return[false, null];
        }
    }
};