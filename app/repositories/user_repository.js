/**
 * Created by prasanna_d on 9/21/2017.
 */
const password_validator = require('password-validator');
const pass_hash = require('password-hash');
const models = require('../database/models');
const jwt = require('jsonwebtoken');
const auth_config = require('../config/config');

//Models
const userModel = require('../models/user_model');

module.exports = {
    userLogin: async function(username, password) {
        try {
            let user = await userModel.getUserByName(username);
            //No match for given email address
            if (user === null) {
                return [401, {message: "username is not associated to any account"}];
            }
            //Check the password with the hashed password
            if (pass_hash.verify(password, user.password)) {
                //Create the login token
                let token = jwt.sign({username: user.username}, auth_config.secret, {
                    expiresIn: 60 * 60 * 24   //Token expire in 24 Hours
                });
                //Return response with user details
                return [200, {username: user.username, token: token}];
            }
            return [401, {message: "Username or password is invalid"}];
        } catch (err) {
            console.log(err); //Log the error
            return [500, {message: "Internal server error"}];
        }
    },
    registerUser: async function(username, password){
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
            return [400, {message: 'Invalid password'}];
        }
        try {
            return [403, {message: 'Registration process is disabled by the admin, ' +
                'Login with admin credentials and enable user registration.'}];
            /*
            let data = await userModel.findOrCreateUser(
                username, pass_hash.generate(password)
            );
            let created = data[1];
            let user = data[0];
            if (created) {
                let token = jwt.sign({username: user.username}, auth_config.secret, {
                    expiresIn: 60 * 60 * 24   //Token expire in 24 Hours
                });
                return [201, {username: user.username, token: token}];
            }
            return [409, {message: 'User already exist'}];
            */
        } catch (err) {
            console.log(err); //Log the error
            return [500, {message: 'Server error occurred'}];
        }
    }
};