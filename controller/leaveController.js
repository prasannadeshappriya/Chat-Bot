module.exports = {
    leaveFunction: async function(session, data){
        //console.log(data.entities.leave[0]);

        if(data.entities.leave[0].value==='null'){
           return session.send("what kind of leave?");
        }
        if(data.entities.leave[0].value==='annual'){
            return session.send("Here's some information about annual leaves.If you are a permanent employee,\n\n" +
                "If the date of <b>commencement</b> of your employment is:\n\n" +
                "   Between 1st January and 31st March: <b>14 days</b>\n\n" +
                "   Between 1st April and 30th June: <b>10 days</b>\n\n" +
                "   Between 1st July and 30th September: <b>7 days</b>\n\n" +
                "   Between 1st October and thereafter: <b>4 days</b>\n\n" +
                "Annual Leave earned in one year can be availed in the next year");
        }
        if(data.entities.leave[0].value==='paternity'){
            return session.send("paternity leave?");
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
            return session.send("half a day leave?");
        }
        if(data.entities.leave[0].value==='casual'){
            return session.send("casual leave?");
        }

    }
};