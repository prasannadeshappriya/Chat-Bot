/**
 * Created by prasanna_d on 11/28/2017.
 */
//Get the controller classes
let apiController = require('../controller/api_controller');

module.exports = function (server,passport) {
    server.post(
        "/api/createApi",
        passport.authenticate('jwt', {session :false}),
        function (req,res) {
            apiController.createAPI(req,res);
        }
    );
    server.get(
        "/api/getAllAPIs",
        passport.authenticate('jwt', {session :false}),
        function (req,res) {
            apiController.getAllAPIs(req,res);
        }
    );
};