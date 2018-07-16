module.exports = function (server, passport) {
    //Google site verification routes
    server.get(
        "/google2b8ac12bca5d3b48.html",
        restify.plugins.serveStatic({
            directory: "./public",
            file: "google2b8ac12bca5d3b48.html"
        })
    );

    //Admin dashboard of the chat-bot
    server.get(
        "/.*/",
        function (req, res, next) {
            res.redirect('https://prasannadeshappriya.alwaysdata.net/dash/', next);
        }
    );
};