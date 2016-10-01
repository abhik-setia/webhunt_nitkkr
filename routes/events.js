var express = require('express');
var router = express.Router();
var mongoose=require('mongoose');

var conn_new_app = mongoose.createConnection('mongodb://localhost/webhunt');
var answer_model=require('../config/models/answer_model')(conn_new_app);
var user_model=require('../config/models/user_model')(conn_new_app);
var question_model=require('../config/models/question_model')(conn_new_app);
var event_model=require('../config/models/event_model')(conn_new_app);

var event_function=require('../config/event_functions');

router.get('/:event_name',function(req,res){

  var event_name=req.params.event_name;
  event_function.getEvent(event_name,function(docs){
    //console.log(docs);
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
      //console.log(result);
      res.json(result);
    });
});

 router.post('/updateEvent',function(req,res){
  event_model.update({event_name:req.body.event_name},
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
     //console.log(result);
     res.json(result);
   });
 });

router.post('/submitTest',function (req,res) {
  var event_name=req.body.event_name;
  var answer_no=req.body.answer_no;
  var answer=req.body.answer;
  var user_email=req.body.user_email;
  var original_answer=req.body.original_answer;

  answer_model.findOne({ $and :[{event_name:event_name},{answer_no:answer_no},{user_email:user_email}]},
    function(err,docs){
      if(err)
      res.send({'error':true,'error_message':'docs are empty'});
      else{
        if(docs==null||docs.length==0){
          var answer=new answer_model({
            user_email:user_email,
            event_name:event_name,
            answer:answer,
            answer_no:answer_no,
            original_answer:original_answer
          });

          answer.save(function(err,docs){
            if(err)
              {
                console.log(err);
                res.send({'error':true,'error_message':'docs are empty'});
              }else{
                user_model.update({$and :[{event_name:event_name},{user_email:user_email}]},
                  { $push :{ answers:docs._id} },function(err,result){
                    if(err)
                    {
                      console.log(err);
                      res.send({'error':true,'error_message':'Failed to update event array'});
                    }else{
                      console.log(result);
                      res.send({'error':false,'error_message':'Inserted'});
                    }
                });
              }
          });

        }else{
          answer_model.update({
            $and :[{event_name:event_name},{answer_no:answer_no},{user_email:user_email}]
          },req.body,{upsert:true}).exec(function(err,docs){
            if(err)
            callback(err);
            else{
              console.log(docs);
              res.send({'error':false,'error_message':'Updated'});
            }
          })
        }
      }
  })
});

router.post('/getAnswers',function (req,res){
var event_name=req.body.event_name;
var user_email=req.body.user_email;
    user_model.findOne({ $and :[{event_name:event_name},{user_email:user_email}]}).populate('answers').exec(function(err,docs){
          if(err)
          console.log(err);
          else{
            if(docs!=null){
              res.json(docs);
            }else{
              res.send({'error':true,'error_message':'Event not found'});
            }
          }
    });
});

router.post('/isEventActive',function(req,res){

var event_name=req.body.event_name;
var user_email=req.body.user_email;

    event_model.find({event_name:event_name},function(err,docs){

      if(docs==null||docs.length==0){
        res.send({'error':true,'error_message':'Event not found'});
      }

      if(err)
      res.send({'error':true,'error_message':'Something went wrong'});

      var start_time=docs[0].start_time;
      var end_time=docs[0].end_time;

      var time_slot=Date.parse(end_time)-Date.parse(start_time);
      var date=new Date();

      user_model.find( { $and : [ {user_email:user_email},{event_name:event_name} ] },function(err,val){
          if(err)
          {
            console.log(err);
            res.send({'error':true,'error_message':'Something went wrong'});
          }

          else{
            if(val==undefined){
                res.send({'error':true,'error_message':"undefined values"});
            }else{
            if(val[0].play_btn_clicked==null||val[0].play_btn_clicked.length==0){
              //clicked first time
              user_model.update({ $and : [ {user_email:user_email},{event_name:event_name} ] },{ $set: { play_btn_clicked:Date.now() } },function(err,updateval){
                if(err)
                {
                  console.log(err);
                  res.send({'error':true,'error_message':'Something went wrong'});
                }else{
                  res.send({'active':docs[0].active,'timer_value':time_slot});
                }
              });

            }else{
              //return timer value with active status
            var btn_clicked_at=Date.parse(val[0].play_btn_clicked);
            var  current_date=new Date();
            var current_time=Date.parse(current_date);
            console.log(btn_clicked_at+" "+current_time);
            if(current_time-btn_clicked_at>time_slot)
              res.send({'active':docs[0].active,'timer_value':'-1'});
            else{
              res.send({'active':docs[0].active,'timer_value':time_slot-(current_time-btn_clicked_at)});
            }
          }
          }
        }
      }


    );

    });

});



module.exports = router;
