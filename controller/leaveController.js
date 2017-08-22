module.exports = {
    leaveFunction: async function(session, data){
        //console.log(data.entities.leave[0]);
        if(data.entities.leave[0].value==='null'){
           return session.send("what kind of leave?");
        }
        if(data.entities.leave[0].value==='annual'){
            return session.send("annual leave?");
        }
        if(data.entities.leave[0].value==='paternity'){
            return session.send("paternity leave?");
        }
        if(data.entities.leave[0].value==='unauthorized absence'){
            return session.send("unauthorized absence leave?");
        }
        if(data.entities.leave[0].value==='encashment on termination'){
            return session.send("encashment on termination leave?");
        }
        if(data.entities.leave[0].value==='no pay'){
            return session.send("no pay leave?");
        }
        if(data.entities.leave[0].value==='medical'){
            return session.send("medical leave?");
        }
        if(data.entities.leave[0].value==='maternity'){
            return session.send("maternity leave?");
        }
        if(data.entities.leave[0].value==='lieu'){
            return session.send("lieu leave?");
        }
        if(data.entities.leave[0].value==='half a day'){
            return session.send("halfday leave?");
        }
        if(data.entities.leave[0].value==='casual'){
            return session.send("casual leave?");
        }

    }
};