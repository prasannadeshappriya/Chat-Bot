/**
 * Created by prasanna_d on 9/19/2017.
 */
let model = require('../database/models');

module.exports = {
    getSession: async function(fbid){
        try {
            return await model.sesson_user.findOne({
                where:{session_id:fbid}
            });
        }catch (err){
            console.log(err); //Display error message
            return null;
        }
    },
    getAllSessions: async function(){
        try {
            return await model.sesson_user.findAll();
        }catch (err){
            console.log(err); //Display error message
            return null;
        }
    },
    updateSession: async function(){
        try {
            return await model.sesson_user.update(
                {session_data: session_data},
                {where: {session_id: fbid}}
            );
        }catch (err){
            console.log(err); //Display error message
            return null;
        }
    },
    createSession: async function(fbid, session_data){
        try {
            return await model.sesson_user.create({
                session_id: fbid,
                session_data: session_data
            });
        }catch (err){
            console.log(err); //Display error message
            return null;
        }
    }
};