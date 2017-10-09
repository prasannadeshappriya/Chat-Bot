/**
 * Created by prasanna_d on 9/21/2017.
 */
//Controllers
const dashboardController = require('../controller/dashboard_controller');

module.exports = function (server, passport) {
    server.post(
        "/intent/create",
        passport.authenticate('jwt', {session :false}),
        function (req,res) {
            dashboardController.createIntent(req,res);
        }
    );
    server.post(
        "/intent/update",
        passport.authenticate('jwt', {session :false}),
        function (req,res) {
            dashboardController.updateIntent(req,res);
        }
    );
    server.get(
        "/intent/get",
        passport.authenticate('jwt', {session :false}),
        function (req,res) {
            dashboardController.getIntent(req,res);
        }
    );
    server.get(
        "/intent/getNames",
        passport.authenticate('jwt', {session :false}),
        function (req,res) {
            dashboardController.getIntentNames(req,res);
        }
    );
    server.post(
        "/intent/delete",
        passport.authenticate('jwt', {session :false}),
        function (req,res) {
            dashboardController.deleteIntent(req,res);
        }
    );
};