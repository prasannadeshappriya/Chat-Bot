const sessions = require('../app');
const compare= require('node-comparison').compare;
const  date_validator= require('DateValidator').DateValidator;

module.exports = {
    leaveFunction: async function(session, data, sessionId){
        //console.log(data.entities.leave[0]);
        if(typeof data.entities.leave!== "undefined") {
            if (data.entities.leave[0].value === 'null') {
                return session.send("what kind of leave?");
            }
            if (data.entities.leave[0].value === 'annual') {
                sessions[sessionId].context.controller = {};
                sessions[sessionId].context.controller.name = "leave";
                sessions[sessionId].context.controller.ques = "annual_leave_count";
                session.send("Here's some information about annual leaves.If you are a permanent employee,\n\n" +
                    "If the date of <b>commencement</b> of your employment is:\n\n" +
                    "   Between 1st January and 31st March: <b>14 days</b>\n\n" +
                    "   Between 1st April and 30th June: <b>10 days</b>\n\n" +
                    "   Between 1st July and 30th September: <b>7 days</b>\n\n" +
                    "   Between 1st October and thereafter: <b>4 days</b>\n\n" +
                    "Annual Leave earned in one year can be availed in the next year");
                session.send("do you want to know  how many leaves have in this year?");

            }
            if (data.entities.leave[0].value === 'paternity') {
                return session.send("paternity leave?");
            }
            if (data.entities.leave[0].value === 'no pay') {
                return session.send("no pay leave?");
            }
            if (data.entities.leave[0].value === 'medical') {
                return session.send("medical leave?");
            }
            if (data.entities.leave[0].value === 'maternity') {
                return session.send("maternity leave?");
            }
            if (data.entities.leave[0].value === 'lieu') {
                return session.send("lieu leave?");
            }
            if (data.entities.leave[0].value === 'half a day') {
                return session.send("half a day leave?");
            }
            if (data.entities.leave[0].value === 'casual') {
                return session.send("casual leave?");
            }
        }
        if(sessions[sessionId].context.controller.ques==="annual_leave_date"){
            let input=data._text;
            let startDate= input.split('-');
            let is_valid= date_validator.validate(startDate[0],startDate[1],startDate[2]);
            if(!is_valid){
                return session.send("Please enter the valid date");
            }
            if(startDate.length < 3){
                return session.send("Enter your date as \"2017-08-09\":)");
            }
            let currentYear= new Date().getUTCFullYear();
            let currentMonth = new Date().getUTCMonth();
            let currentDay= new Date().getUTCDate();
            let year= parseInt(startDate[0]);
            if(currentYear<year){
                return session.send("Ohh, I think you are not a member of Eyepax family yet :P")
            }
            if(currentYear===year){
                if ((currentMonth + 1) < parseInt(startDate[1])) {
                    return session.send("Ohh, I think you are not a member of Eyepax family yet :P")
                }
                if (currentDay < parseInt(startDate[2])) {
                    return session.send("Ohh, I think you are not a member of Eyepax family yet :P")
                }
            }

            let date= new Date(year,parseInt(startDate[1]),parseInt(startDate[2]));

            if(compare('date','within',date, new Date(year,1,1), new Date(year,3,31))){
                session.send("You have Annual leave of 14 days");
            }else if(compare('date','within',date, new Date(year,4,1), new Date(year,6,30))){
                session.send("You have Annual leave of 10 days");
            }else if(compare('date','within',date, new Date(year,7,1), new Date(year,9,30))){
                session.send("You have Annual leave of 7 days");
            }else{
                session.send("You have Annual leave of 4 days");
            }
            // return sessions[sessionId].context.controller.name = "";
        }
        if(data._text.contains("yes")){
            if(sessions[sessionId].context.controller.ques==="annual_leave_count"){
                sessions[sessionId].context.controller.ques = "annual_leave_date";
                return session.send("Sure, What is your start date? [Eg: 2007-08-09]");
            }
        }
        if(data._text.contains("no")){
            if(sessions[sessionId].context.controller.ques==="annual_leave_count"){
                sessions[sessionId].context.controller.name = "";
                return session.send("Sure, Ask me something else then :)");
            }
        }
    }
};