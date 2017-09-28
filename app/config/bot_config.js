/**
 * Created by prasanna_d on 9/26/2017.
 */
module.exports = function (builder) {
    //Microsoft bot framework id and password

    // Old App
    // let connector = new builder.ChatConnector({
    //     appId: "ab2d1a14-71e9-48a2-9bdb-d9b94cf9aa1a",
    //     appPassword: "AbKPomU0PRVkEEzoOo3Sejf"
    // });

    //New App
    return new builder.ChatConnector({
        appId: "46635ff5-b684-4f46-bdb7-67b284227cb7",
        appPassword: "hmn9RFpn033wLjHSLn9it7w"
    });
};