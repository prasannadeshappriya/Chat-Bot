/**
 * Created by prasanna_d on 9/21/2017.
 */
//Controllers
const userController = require('../controller/user_controller');

module.exports = function (server) {
    server.post('user/create', userController.register);
    server.post('user/login', userController.login);
};