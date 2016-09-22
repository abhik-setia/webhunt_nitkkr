var express = require('express');
var router = express.Router();
var register_function=require('../config/register_function');

router.post('/', function(req, res){
  
    var event_name=req.body.event_name;
    var user_name=req.body.user_name;
    var user_roll_no=req.body.user_roll_no;
    var user_branch=req.body.user_branch;
    var user_year=req.body.user_year;
    var user_email=req.body.user_email;
    var user_phone_no=req.body.user_phone_no;


    register_function.registerUser(event_name,user_name,user_roll_no
      ,user_branch,user_year,user_email,user_phone_no,function(result){
      console.log(result);
      res.json(result);
    });

  });

module.exports=router;
