const sessions = require('../app');
const compare= require('node-comparison').compare;
const  date_validator= require('DateValidator').DateValidator;

module.exports = {
    leaveFunction: async function(session, data, sessionId){
        //console.log(data.entities.leave[0]);
        if(typeof data.entities.leave!== "undefined") {
            switch(data.entities.leave[0].value){
                case 'null':
                    return session.send("what kind of leave?");
                case 'annual':
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

                    session.send("-You can apply only <b>3-7 days</b> Annual Leave at <b>one occasion</b>\n\n" +
                        "-You must apply Annual Leave <b>two months prior</b> to leave dates\n\n" +
                        "-<b>More than one person in a your team is not allowed</b> to apply for Annual Leave at once to ensure smooth delivery");

                    return session.send("do you want to know  how many Annual leaves do you have in this year?");
                case 'casual':
                    return session.send("Your Casual Leave entitlement is <b>7 days per year</b>, and can apply only 1-2 days casual leave at <b>one occasion</b>. \n\n" +
                        " You cannot be utilized Casual Leave immediately before or after annual leave<br>" +
                        "You must apply casual leave <b>2 weeks prior</b> to the leave date stating the reason<br>" +
                        "You cannot utilize any casual leave upon submission of the letter of resignation(while serving the resignation notice)<br>");
                case 'half a day':
                    return session.send("You can apply Half a Day Leave only for <b>casual and sick</b> purposes<br>" +
                        "You can take either the 1st or the 2nd half (as specified below) on a single day, provided that You works a minimum of 5 hrs excluding the lunch break.<br><br>" +
                        "   -1st Half:    9.00.a.m. – 1.30.p.m.<br>" +
                        "   -2nd Half:   1.30 .p.m. – 6.30.p.m.<br><br>");
                case 'medical':
                    session.send("You can apply Medical Leave if granted by the Letter of Appointment or upon completion of the below stipulated tenure in the organization.<br>" +
                        "   -You will be entitled with remuneration to seven days of Medical leave through the letter of appointment or by fulfilling below tenure requirements.<br>" +
                        "   -If medical leave is taken for more than two days, it should be supported by a medical certificate from a registered western qualified medical practitioner.<br>");

                    return session.send("These are the tenure requirements in the Eyepax <br>"
                        +"  -If you complete four years with the company you will be entitled for 7 days of medical leave per year.<br>" +
                        "   -If you confirmed emplyee, before completing four years, will be entitled for one day medical leave for each completed six months annually.<br>" +
                        "   -If you are in Technical Lead/ Senior Technical Lead / Manager and above positions will be entitled for 7 days of medical leave upon completion of two years.<br>" +
                        "   -You cannot utilize any Medical leave upon submission of the letter of resignation(while serving the resignation notice)<br>");
                case 'maternity':
                    return session.send("If you are a Female employee you are entitled to <b>84 working days</b> as maternity leave for your <b>first</b> and <b>second</b> child.<br>" +
                        "Where You already has two children, in respect of the birth of the third child she is entitled to 42 working days on full pay.<br>" +
                        "You entitled to maternity leave as above, the confinement must result in the birth of a <b>live child</b>.");
                    case 'paternity':
                    return session.send("If you are a Male employee you will be granted <b>5 days</b> of paid leave on your child's birth<br>" +
                        "You should be the biological father of the child or legal father of the child adopted to be eligible for the paternity leave.<br>" +
                        "In case of a Child birth / adoption you or your supervisor should inform the management and HR team to enable the paternity leave in the leave and attendance system.");

                case 'lieu':
                    return session.send("You may be permitted to take lieu leave, with full remuneration for the days you have worked in weekends / special holidays on Company’s / management request.<br>" +
                        "Lieu Leave must be applied 7 days prior to the leave date.<br>" +
                        "Lieu leave can be applied during the calendar year and if not utilized, available lieu leave will be encashed.<br>" +
                        "Lieu leave cannot be carried forward to another calendar year.<br>" +
                        "All Lieu Leave allocation requests should be approved by the management.");

                case 'no pay':
                    return session.send("If you have exhausted your allocated leave quota for the calendar year will be put on no pay leave. Any such requirement should be approved by the management at all times and the approval will be given on a case by case basis");


            }
        }
        if(sessions[sessionId].context.controller.ques==="annual_leave_date"){
            let input=data._text;
            let startDate= input.split('-');
            let is_valid= date_validator.validate(startDate[0],startDate[1],startDate[2]);
            if(!is_valid){
                return session.send("Please enter the valid date.. [Eg: 2007-08-30]");
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
            return sessions[sessionId].context.controller.name = "";
        }
        if(data._text.contains("yes")){
            if(sessions[sessionId].context.controller.ques==="annual_leave_count"){
                sessions[sessionId].context.controller.ques = "annual_leave_date";
                return session.send("Sure, What is your start date? [Eg: 2007-08-30]");
            }
        }else if(data._text.contains("no")){
            if(sessions[sessionId].context.controller.ques==="annual_leave_count"){
                sessions[sessionId].context.controller.name = "";
                return session.send("Sure, Ask me something else then :)");
            }
        }else{
            return session.send("Please answer the question :-P");
        }
    }
};