module.exports= {
    leavePolicyFunction: async function(session,data){
        if(data.entities.leavePolicy[0].value==='null'){
            session.send("There are 10 types of leaves." +
                "1.Annual leave - Permanent full time" +
                "2.Casual leave" +
                "3.Half a day leave")
            return session.send("you can refer more on: https://www.yammer.com/api/v1/uploaded_files/78078803/download");
        }
    }
};