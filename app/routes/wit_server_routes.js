/**
 * Created by prasanna_d on 9/21/2017.
 */
//Controllers
const witController = require('../controller/wit_controller');

module.exports = function (server,passport) {
    server.post(
        "/wit/updateWitData",
        passport.authenticate('jwt', {session :false}),
        function (req,res) {
            witController.updateWitData(req,res);
        }
    );
    server.post(
        "/wit/deleteWitData",
        passport.authenticate('jwt', {session :false}),
        function (req,res) {
            witController.deleteWitData(req,res);
        }
    );
    server.get(
        "/wit/getEntityById",
        passport.authenticate('jwt', {session :false}),
        function (req,res) {
            witController.getEntityById(req,res);
        }
    );
    server.post(
        "/wit/deleteEntity",
        passport.authenticate('jwt', {session :false}),
        function (req,res) {
            witController.deleteEntity(req,res);
        }
    );
    server.get(
        "/wit/getEntities",
        passport.authenticate('jwt', {session :false}),
        function (req,res) {
            witController.getEntities(req,res);
        }
    );
    server.post(
        "/wit/putEntityById",
        passport.authenticate('jwt', {session :false}),
        function (req,res) {
            witController.putEntityById(req,res);
        }
    );
    server.post(
        "/wit/postEntity",
        passport.authenticate('jwt', {session :false}),
        function (req,res) {
            witController.postEntity(req,res);
        }
    );
    server.get(
        "/wit/getMessage",
        passport.authenticate('jwt', {session :false}),
        function (req,res) {
            witController.getMessage(req,res);
        }
    );
    server.post(
        "/wit/postSample",
        passport.authenticate('jwt', {session :false}),
        function (req,res) {
            witController.postSample(req,res);
        }
    );
};