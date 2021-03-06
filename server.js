//import the modules

const express=require("express");
const mongodb=require("mongodb");
const cors=require("cors");
//const bodyParser=require("body-parser");
const jsonwebtoken=require("jsonwebtoken");
const dotenv=require("dotenv");
const obj=require("./token");
dotenv.config();
//create the rest object
const app=express();
//app is the rest object.
 

//MIME-comunication languge between client and server.
app.use(express.json());

//create the reference variable to connect to monogodb database.
const miniproject=mongodb.MongoClient;

 
//create the rest api (post request)
app.post("/login",(req,res)=>{
    miniproject.connect(process.env.CONNECTION_URL,(err,connection)=>{
        if(err) throw err;
        else{
           const db=connection.db(process.env.DATABASE_NAME);
           db.collection(process.env.COLLECTION_NAME).find({"email":req.body.email,"password":req.body.password}).toArray((err,array)=>{
            if(err) throw err;
            else{
                let label=process.env.RESPONSE_LABEL;
                let success=process.env.SUCCESS_RESPONSE;
                let failure=process.env.FAILURE_RESPONSE;
                if(array.length>0){
                   obj.token=jsonwebtoken.sign({"email":req.body.email,"password":req.body.password},
                    process.env.SECRETE_KEY,{expiresIn:'30d'});
                    res.status(200).send({[label]:success,"token":obj.token});

                }else{
                    res.send({[label]:failure});
                }
            }
           })

        }
    });

});
let port=process.env.PORT ||1234;
app.listen(port,()=>{
    console.log("server Started!!!!");
});