/**
 * Created by prasanna_d on 9/21/2017.
 */
const models = require('../database/models');

module.exports = {
    getUserByName: async function(username){
        return await models.user.findOne({
            where: {username: username}
        });
    },
    findOrCreateUser: async function(username, password){
        return await models.user.findOrCreate({
            where: {
                username: username
            },
            defaults: {
                username: username,
                password: password
            }
        });
    }
};