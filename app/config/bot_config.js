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
        appId: "2d6d80a1-c870-4431-9332-70b3f0b891c6",
        appPassword: "AAKWVOiu77WROdH9q9bfe0g"
    });
};