/**
 * Created by prasanna_d on 9/21/2017.
 */
//Controllers
const settingsController = require('../controller/settings_controller');

module.exports = function (server,passport) {
    server.post(
        "/settings/update",
        passport.authenticate('jwt', {session :false}),
        function (req,res) {
            settingsController.updateSettings(req,res);
        }
    );
    server.get(
        "/settings/get",
        passport.authenticate('jwt', {session :false}),
        function (req,res) {
            settingsController.getSettings(req,res);
        }
    );
};