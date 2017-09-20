/**
 * Created by prasanna_d on 9/15/2017.
 */
const dashboardController = require('../controller/dashboard_controller');
const witController = require('../controller/wit_controller');
const userController = require('../controller/user_controller');
const mainController = require('../controller/message_controller');
const settingsController = require('../controller/settings_controller');

module.exports = function (server,passport,connector,bot,builder) {
    //Broadcast message
    server.post(
        "/broadcast",
        passport.authenticate('jwt', {session :false}),
        async function (req,res) {
            let message = req.body.message;
            if(typeof message === 'undefined' ||
                message === ''){return res.send(400,{message: 'message required'});}
            let result = await mainController.sendBroadcastMessage(bot,builder,message.split('\n'));
            return res.send(200,{sent_users: result});
        }
    );
    //Message server routes
    server.post('/api/messages', connector.listen());
    //User Authentication Routes
    server.post('user/create', userController.register);
    server.post('user/login', userController.login);
    //Server routes--------------------------------------------------------------------------------------------
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
        "/entity/getEntityData",
        passport.authenticate('jwt', {session :false}),
        function (req,res) {
            dashboardController.getEntityData(req,res);
        }
    );
    server.post(
        "/intent/delete",
        passport.authenticate('jwt', {session :false}),
        function (req,res) {
            dashboardController.deleteIntent(req,res);
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
    //Wit.AI server routes
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

//Backup route
// server.post('/api/messages', connector.listen());
// server.post('/intent/create', dashboardController.createIntent);
// server.get('/intent/get', dashboardController.getIntent);
// server.post('/intent/delete', dashboardController.deleteIntent);
// server.post('/entity/create', dashboardController.createEntity);
// server.get('/entity/get', dashboardController.getEntity);
// server.get('/wit/getEntityById', witController.getEntityById);
// server.get('/wit/getEntities', witController.getEntities);
// server.post('/wit/putEntityById', witController.putEntityById);
// server.post('/wit/postEntity', witController.postEntity);
// server.get('/wit/getMessage', witController.getMessage);
// server.post('/wit/postSample', witController.postSample);

