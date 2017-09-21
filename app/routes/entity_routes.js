/**
 * Created by prasanna_d on 9/21/2017.
 */
//Controllers
const dashboardController = require('../controller/dashboard_controller');

module.exports = function (server,passport) {
    server.get(
        "/entity/getEntityData",
        passport.authenticate('jwt', {session :false}),
        function (req,res) {
            dashboardController.getEntityData(req,res);
        }
    );
    server.post(
        "/entity/update",
        passport.authenticate('jwt', {session :false}),
        function (req,res) {
            dashboardController.updateEntity(req,res);
        }
    );
    server.post(
        "/entity/delete",
        passport.authenticate('jwt', {session :false}),
        function (req,res) {
            dashboardController.deleteEntityValue(req,res);
        }
    );
    server.post(
        "/entity/create",
        passport.authenticate('jwt', {session :false}),
        function (req,res) {
            dashboardController.createEntity(req,res);
        }
    );
    server.post(
        "/entity/createOrUpdateEntityValue",
        passport.authenticate('jwt', {session :false}),
        function (req,res) {
            dashboardController.createOrUpdateEntityValue(req,res);
        }
    );
};