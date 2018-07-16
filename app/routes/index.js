/**
 * Created by prasanna_d on 9/21/2017.
 */

//Route configurations
module.exports = function (server,passport,connector,bot,builder) {
    //View-page routes and redirect links
    require('../../app/routes/page_redirect_routes')(
        server);

    //Wit server routes
    require('../../app/routes/wit_server_routes')(
        server,passport);

    //login and register routes
    require('../../app/routes/user_routes')(
        server);

    //Message routes
    require('../../app/routes/message_routes')(
        server,passport,builder,connector,bot);

    //Entity routes
    require('../../app/routes/entity_routes')(
        server,passport);

    //intent routes
    require('../../app/routes/intent_routes')(
        server,passport);

    //settings routes
    require('../../app/routes/settings_routes')(
        server,passport);

    //API routes
    require('../../app/routes/api_routes')(
        server,passport);
};