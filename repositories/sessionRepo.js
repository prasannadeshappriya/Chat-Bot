/**
 * Created by prasanna_d on 9/19/2017.
 */
let model = require('../database/models');

module.exports = {
    getSession: async function(fbid){
        try {
            let result = await model.sesson_user.findOne({
                where:{session_id:fbid}
            });
            if(result){
                return [true,result];
            }else{return [false,null];}
        }catch (err){
            return[false, null];
        }
    },
    getAllSessions: async function(){
        try {
            let result = await model.sesson_user.findAll();
            if(result){
                return [true,result];
            }else{return [false,null];}
        }catch (err){
            return[false, null];
        }
    },
    createOrUpdateSession: async function(fbid, session_data){
        let result = await this.getSession(fbid);
        try {
            if (result[0]) {
                let response = await model.sesson_user.update(
                    {session_data: session_data},
                    {where: {session_id: fbid}}
                );
                return [true, response];
            } else {
                let response = await model.sesson_user.create({
                    session_id: fbid,
                    session_data: session_data
                });
                return [true, response];
            }
        }catch (err){
            return[false, null];
        }
    }
};