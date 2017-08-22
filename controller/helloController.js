/**
 * Created by prasanna_d on 8/22/2017.
 */
module.exports = {
    helloFunction: async function(session, data){
        console.log(data.entities.leave[0]);
        session.send("Hi.. What is your name? my name is a");
    }
};


