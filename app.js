const express = require("express");
const axios   = require("axios");
const bodyParser = require("body-parser");
const request = require("request");
const path    = require("path");
const util    = require("util");

// : path
var publicPath = path.join(__dirname ,"./public");
// : variables
var key = '';

// : creating app instance
const app = express();

// # middleware : bodyparser
app.use(bodyParser.urlencoded({extended:true}));
// $ setting view engine : ejs
app.set("view engine","ejs");
// # middleware : static
app.use(express.static(publicPath));

// : api key generator
function generateKey(){
        request.post('https://bhagavadgita.io/auth/oauth/token',
                   { form:{ 
                    client_id : "zn5Jmj2xANpT2emcnUFgOlw1G6VO1bkAYeNnOXEA",
                    client_secret:"1zuHyN1FbfNOX0Vn0NOgxcXqz6dxzhlZk09SdgRZ0ydDHIqzhk",
                    grant_type:"client_credentials",
                    scope :"verse chapter"}},function(err,res,body){
                        body = JSON.parse(body);
                        key = body.access_token;

                    })        

}


app.get('/root',function(req,res){
    res.render("root");
});
// @route : '/'
// @desc  : get the root of the page
// @access: public
app.get('/',function(req,res,next){
    axios.get("https://bhagavadgita.io/api/v1/chapters",{
        params:{
            access_token:`${key}`
        }
    })
    .then(function(response){
       // console.log(response);
        res.render("index",{data:response});
    })
    .catch(function(error){
        console.log("---root ---");
        console.log(error);
    })
    
});

// @route : '/chapter/show/:id'
// @desc  : shows the chapter
// @access: public
app.get("/chapter/show/:id",function(req,res,next){
    console.log(req.params.id);
    let id = req.params.id;
    axios.get("https://bhagavadgita.io/api/v1/chapters/"+id,{
        params:{
            access_token:`${key}`
        }
    })
    .then(function(response){
        console.log(response.data);
       res.render("show",{data:response.data});
    })
    .catch(function(error){
        console.log(error);
    });
});

// @route : '/chapters/show/:id/verses'
// @desc  : shows the verses of each chapter
// @access: public
app.get("/chapter/show/:id/verses",function(req,res,next){
    let id  = req.params.id;
    let url = util.format("https://bhagavadgita.io/api/v1/chapters/%s/verses",id);
    axios.get(url,{
        params:{
            access_token:`${key}`
        }
    })
    .then(function(response){
        console.log(response.data);
        res.render("verses",{data:response.data});
    })
    .catch(function(error){
        console.log(error);
    });
});

// : listen to port : 3000
app.listen(3001,function(){
    generateKey();
    console.log("app start and running");
});
