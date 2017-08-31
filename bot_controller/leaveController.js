const sessions = require('../app');
const compare= require('node-comparison').compare;
const  date_validator= require('DateValidator').DateValidator;
const rn= require('random-number');

module.exports = {
    leaveFunction: async function(session, data, sessionId){
        //console.log(data.entities.leave[0]);
        let response = ["So.. How can i help you more? :)", "Ask me something else :)",
            "Tell me about your questions, I'll help if i can :)"];
        let options;
        if(typeof data.entities.leave!== "undefined") {
            switch(data.entities.leave[0].value){
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
                        "<b>Annual Leave earned in one year can be availed in the next year</b>");
                    session.send("Keep in your mind that, \n\n-You can apply only <b>3-7 days</b> Annual Leaves at <b>one occasion</b>\n\n" +
                        "-You must apply Annual Leaves <b>two months prior</b> to leave dates\n\n" +
                        "-<b>More than one person in a your team is not allowed</b> to apply for Annual Leave at once to ensure smooth delivery");
                    return session.send("Would you like to know about the number of annual leaves you have?");
                case 'casual':
                    session.send("Your Casual Leave entitlement is <b>7 days per year</b>, and can apply only <b>1-2 days</b> casual leave at" +
                        " <b>one occasion</b>. \n\n" +
                        " You cannot be utilized Casual Leave immediately <b>before or after annual leave</b> \n\n" +
                        " You must apply casual leave <b>2 weeks prior</b> to the leave date stating the reason \n\n" +
                        " You cannot utilize any casual leave upon submission of the letter of resignation(while serving the resignation notice) \n\n");
                    options={min:0, max: 2, integer: true};
                    return session.send(response[rn(options)]);
                case 'half a day':
                    session.send("You can apply Half a Day Leave only for <b>casual and sick</b> purposes :) \n\n" +
                        "You can take either the 1st or the 2nd half (as specified below) on a single day, provided that You works a minimum of 5 hrs " +
                        "excluding the lunch break. \n\n" +
                        "   -1st Half:    9.00.a.m. – 1.30.p.m. \n\n" +
                        "   -2nd Half:   1.30 .p.m. – 6.30.p.m. \n\n");
                    options={min:0, max: 2, integer: true};
                    return session.send(response[rn(options)]);
                case 'medical':
                    session.send("You can apply Medical Leave if granted by the <b>Letter of Appointment</b> or upon completion of the below stipulated tenure in the organization. \n\n" +
                        "   -You will be entitled with remuneration to seven days of Medical leave through the letter of appointment or by fulfilling below tenure requirements. \n\n" +
                        "   -If medical leave is taken for <b> more than two days</b>, it should be supported by a medical certificate from a registered western qualified medical practitioner. \n\n");
                    session.send("These are the tenure requirements in the Eyepax :) \n\n" +
                        "   -If you complete <b>four years</b> with the company you will be entitled for<b>7 days of medical leave per year</b>. \n\n" +
                        "   -If you confirmed employee, before completing four years, will be entitled for one day medical leave for each completed six months annually. \n\n" +
                        "   -If you are in <b>Technical Lead/Senior Technical Lead/Manager</b> and above positions will be entitled for <b>7 days of medical leaves</b> upon completion of two years. \n\n" +
                        "   -You cannot utilize any Medical leave upon submission of the letter of resignation(while serving the resignation notice) \n\n");
                    options={min:0, max: 2, integer: true};
                    return session.send(response[rn(options)]);
                case 'maternity':
                    session.send("If you are a Female employee you are entitled to <b>84 working days</b> as maternity leave for your <b>first</b> and <b>second</b> child. \n\n" +
                        "Where You already has two children, in respect of the birth of the third child she is entitled to 42 working days on full pay. \n\n" +
                        "You entitled to maternity leave as above, the confinement must result in the birth of a <b>live child</b>.");
                    options={min:0, max: 2, integer: true};
                    return session.send(response[rn(options)]);
                case 'paternity':
                    session.send("If you are a Male employee you will be granted <b>5 days</b> of paid leave on your child's birth \n\n" +
                        "You should be the <b>biological father of the child or legal father </b>of the child adopted to be eligible for the paternity leave. \n\n" +
                        "In case of a Child birth / adoption you or your supervisor should inform the management and HR team to enable the paternity leave in the leave and attendance system.");
                    options={min:0, max: 2, integer: true};
                    return session.send(response[rn(options)]);
                case 'lieu':
                    session.send("You may be permitted to take lieu leave, with full remuneration for the days you have worked in weekends/special holidays on Company’s/management request. \n\n" +
                        "Lieu Leave must be applied <b>7 days</b> prior to the leave date. \n\n" +
                        "Lieu leave can be applied during the calendar year and if not utilized, available lieu leave will be encashed. \n\n" +
                        "Lieu leave <b>cannot be carried forward to another calendar year</b>. \n\n" +
                        "All Lieu Leave allocation requests <b>should be approved by the management</b>.");
                    options={min:0, max: 2, integer: true};
                    return session.send(response[rn(options)]);
                case 'no pay':
                    session.send("If you have exhausted your allocated leave quota for the calendar year will be put on no pay leave. " +
                        "Any such requirement should be approved by the management at all times and the approval will be " +
                        "given on a case by case basis");
                    options={min:0, max: 2, integer: true};
                    return session.send(response[rn(options)]);
                case 'null':
                    session.send("These are the leave you can apply,\n\n" +
                        "1.<b>Annual leave</b> - Permanent full time\n\n" + "2.<b>Casual leave</b>\n\n" +
                        "3.<b>Half a day leave</b>\n\n" + "4.<b>Medical leave</b>\n\n" + "5.<b>Maternity leave</b>\n\n" + "6.<b>Paternity leave</b>\n\n" +
                        "7.<b>Lieu leave</b>\n\n" + "8.<b>No Pay Leave</b>\n\n" +
                        "You can also ask me about <b>leave policies</b> as well");
                    return session.send("What kind of leave you would like to know more?");
            }
        }
        if(sessions[sessionId].context.controller.ques==="annual_leave_date"){
            let input= data._text;
            let startDate=[];
            let con = false;
            for(let i=0; i<(input.length-9); i++){
                let date = input.slice(i,i+10);
                startDate= date.split('-');
                let is_valid= date_validator.validate(startDate[0],startDate[1],startDate[2]);
                if((startDate.length >= 3) && (is_valid)){
                    con = true;
                    break;
                }
            }
            if(con) {
                let currentYear = new Date().getUTCFullYear();
                let currentMonth = new Date().getUTCMonth();
                let currentDay = new Date().getUTCDate();
                let year = parseInt(startDate[0]);
                if (currentYear < year) {
                    return session.send("Ohh, I think you are not a member of Eyepax family yet :P/n/n" +
                        "Tell me the date again if you like to know about your annual leave count. :)")
                }
                if (currentYear === year) {
                    if ((currentMonth + 1) < parseInt(startDate[1])) {
                        return session.send("Ohh, I think you are not a member of Eyepax family yet :P/n/n" +
                            "Tell me the date again if you like to know about your annual leave count. :)")
                    }
                    if (currentDay < parseInt(startDate[2])) {
                        return session.send("Ohh, I think you are not a member of Eyepax family yet :P/n/n" +
                            "Tell me the date again if you like to know about your annual leave count. :)")
                    }
                }
                let date = new Date(year, parseInt(startDate[1]), parseInt(startDate[2]));
                if (compare('date', 'within', date, new Date(year, 1, 1), new Date(year, 3, 31))) {
                    session.send("You have Annual leave of 14 days");
                } else if (compare('date', 'within', date, new Date(year, 4, 1), new Date(year, 6, 30))) {
                    session.send("You have Annual leave of 10 days");
                } else if (compare('date', 'within', date, new Date(year, 7, 1), new Date(year, 9, 30))) {
                    session.send("You have Annual leave of 7 days");
                } else {
                    session.send("You have Annual leave of 4 days");
                }
                sessions[sessionId].context.controller.name = "";
                options={min:0, max: 2, integer: true};
                return session.send(response[rn(options)]);
            }else{
                return session.send("I can only understand dates in 'YYYY-MM-DD' format :(/n/n" +
                    "Tell me the date again if you like to know about your annual leave count.");
            }
        }
        if(data._text.contains("yes")){
            if(sessions[sessionId].context.controller.ques==="annual_leave_count"){
                sessions[sessionId].context.controller.ques = "annual_leave_date";
                return session.send("Sure, What is your start date? [Eg: I think 2007-08-30 :)]");
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