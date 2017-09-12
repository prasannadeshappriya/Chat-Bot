/**
 * Created by prasanna_d on 9/12/2017.
 */
const password_validator = require('password-validator');
const pass_hash = require('password-hash');
const models = require('../database/models');
const jwt = require('jsonwebtoken');
const auth_config = require('../auth_config/config');

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

        try{
            let user = await models.user.findOne({
                where: {
                    username: username
                }
            });
            //No match for given email address
            if(user===null){
                return res.json(401,{message: "username is not associated to any account"});
            }
            //Check the password with the hashed password
            if(pass_hash.verify(password,user.password)) {
                //Create the login token
                let token = jwt.sign({username : user.username}, auth_config.secret,{
                    expiresIn: 60*60*24   //Token expire in 24 Hours
                });
                //Return response with user details
                return res.json(200,{username: user.username,
                    token: token});
            }
            //Unauthorized access
            return res.json(401,{message: "Username or password is invalid"});
        }catch(err){
            console.log('Error occured: ', err);
            return res.json(500,{message: "Server error occurred"});
        }
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

        // Create a schema
        let schema = new password_validator();
        // Add properties to it
        schema
            .is().min(8)                                    // Minimum length 8
            .is().max(100)                                  // Maximum length 100
            .has().uppercase()                              // Must have uppercase letters
            .has().lowercase()                              // Must have lowercase letters
            .has().digits()                                 // Must have digits
            .has().not().spaces();                          // Should not have spaces
        if(!schema.validate(password)){
            return res.json(400,{message: 'Invalid password'});
        }

        try {
            let data = await models.user.findOrCreate({
                where: {
                    username: username
                },
                defaults: {
                    username: username,
                    password: pass_hash.generate(password)
                }
            });

            let created = data[1];
            let user = data[0];
            if (created) {
                let token = jwt.sign({username: user.username}, auth_config.secret, {
                    expiresIn: 60 * 60 * 24   //Token expire in 24 Hours
                });
                return res.json(201,{username: user.username,
                        token: token});
            }
            return res.json(409,{message: 'User already exist'});
        } catch (err) {
            console.log('Error occured: ', err);
            return res.json(500,{message: 'Server error occurred'});
        }
    }
};