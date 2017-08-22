module.exports= {
    leavePolicyFunction: async function(session,data){
        if(data.entities.leavePolicy[0].value==='null'){
            session.send("There are several types of leaves.\n\n" +
                "1.Annual leave - Permanent full time\n\n" + "2.Casual leave\n\n" +
                "3.Half a day leave\n\n" + "4.Medical leave\n\n" + "5.Maternity leave\n\n" + "6.Paternity leave\n\n" + "7.Lieu leave\n\n" + "8.No Pay Leave\n\n"
            );
            return session.send("you can refer more on: https://www.yammer.com/api/v1/uploaded_files/78078803/download");
        }
    }
};