var express = require('express');
var router = express.Router();
var mongoose=require('mongoose');

var conn_new_app = mongoose.createConnection('mongodb://localhost/webhunt');
//var user_model=require('../config/models/user_model')(conn_new_app);
//var question_model=require('../config/models/question_model')(conn_new_app);
var event_model=require('../config/models/event_model')(conn_new_app);

var event_function=require('../config/event_functions');

router.get('/:event_name',function(req,res){

  var event_name=req.params.event_name;
  event_function.getEvent(event_name,function(docs){
    console.log(docs);
    res.json(docs);
  });
});

router.post('/addEvent',function(req,res){

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

 router.post('/updateEvent',function(req,res){
  event_model.update({event_name:event_name},
              req.body,
             {upsert:true},function(err,docs){
               if(err)
               {
                  console.log(err);
                  res.send({'error':'true'});
               }else{
                 res.send({'error':'false','status':'Update successfult'});
               }
              });

 });

 router.post('/addQuestion',function(req,res){
   var event_name=req.body.event_name;
   var event_id=req.body.event_id;
   var question_no=req.body.question_no;
   var question=req.body.question;
   var answer=req.body.answer;


   event_function.addQuestion(event_name,event_id,question_no,question,answer,function(result){
     console.log(result);
     res.json(result);
   });
 });
module.exports = router;
