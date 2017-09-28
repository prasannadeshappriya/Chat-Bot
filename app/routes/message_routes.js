/**
 * Created by prasanna_d on 9/21/2017.
 */
//Controllers
const messageController = require('../controller/message_controller');

module.exports = function (server,passport,builder,connector,bot) {
    //Broadcast message
    server.post(
        "/broadcast",
        passport.authenticate('jwt', {session :false}),
        async function (req,res) {
            let message = req.body.message;
            if(typeof message === 'undefined' ||
                message === ''){return res.send(400,{message: 'message required'});}
            let result = await messageController.sendBroadcastMessage(bot,builder,message);
            return res.send(200,{sent_users: result});
        }
    );
    //Message server routes
    server.post('/api/messages', connector.listen());
};