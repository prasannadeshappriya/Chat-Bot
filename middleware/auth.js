/**
 * Created by prasanna_d on 9/12/2017.
 */
module.exports = {
    tokenAuth:function(req,res,callback){
        //Printing routes
        console.log('http://localhost:3000' + req.route.path);

        //Store token value
        let token;
        console.log('-----------------');
        console.log(req.headers);
        console.log('-----------------');
        //Get the token value from the request
        switch (req.route.method){
            case 'POST':
                if (typeof req.body !== 'undefined') {token = req.body.token;}
                break;
            case 'GET':
                if(typeof req.query !== 'undefined'){token = req.query.token;}
                break;
        }
        // if(token==='' || typeof token==='undefined'){
        //     return res.json(401,{message: 'Unauthorized'});}
        // console.log(token);
        callback(req,res);
    }
};