module.exports = {
    leaveFunction: async function(session, data){
        console.log(data.entities.leave[0]);
        session.send("what kind of leaqve?");
    }
};