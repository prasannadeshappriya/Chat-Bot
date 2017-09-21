/**
 * Created by prasanna_d on 9/12/2017.
 */
//Repositories
const userRepository = require('../repositories/user_repository');

module.exports = {
    login: async function(req,res){
        if(typeof req.body==='undefined'){
            return res.json(400,{message: '\'username\' and \'password\' are required'});}
        let username = req.body.username;
        let password = req.body.password;
        if(typeof username==='undefined' ||
            username===''){return res.json(400,{message: '\'username\' is required'});}
        if(typeof password==='undefined' ||
            password===''){return res.json(400,{message: '\'password\' is required'});}
        //Authenticate user login credentials
        let response = await userRepository.userLogin(username, password);
        return res.json(response[0], response[1]);
    },
    register: async function(req,res){
        if(typeof req.body==='undefined'){
            return res.json(400,{message: '\'username\' and \'password\' are required'});}
        let username = req.body.username;
        let password = req.body.password;
        if(typeof username==='undefined' ||
            username===''){return res.json(400,{message: '\'username\' is required'});}
        if(typeof password==='undefined' ||
            password===''){return res.json(400,{message: '\'password\' is required'});}
        //Create the user account and login in
        let response = await userRepository.registerUser(username,password);
        return res.json(response[0], response[1]);
    }
};