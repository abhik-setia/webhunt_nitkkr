var express = require('express');
var router = express.Router();

var event_function=require('../config/event_functions');

// router.get('/:event_name',function(req,res){
//
// });

router.post('/addEvent',function(req,res){
  console.log('hello');
    var event_name=req.body.event_name;
    var event_date=req.body.event_date;
    var start_time=req.body.start_time;
    var end_time=req.body.end_time;
    var society=req.body.society;
    var passcode=req.body.passcode;
    var rules_array=req.body.rules;


    event_function.addEvent(event_name,event_date,start_time,end_time,
      society,passcode,rules_array,function(result){
      console.log(result);
      res.json(result);

    });

});

// router.post('/updateEvent',function(req,res){
//
// });
module.exports = router;
