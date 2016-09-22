var mongoose=require('mongoose');
var MongoClient=require('mongodb').MongoClient;

var event_model=require('./models/event_model');

exports.addEvent=function(event_name,event_date,start_time,end_time,
  society,passcode,rules_array,callback){

      if(event_name!=null && event_name!=undefined){

        event_model.find({event_name:event_name},function(err,docs){

          if(docs==null||docs.length==0){


              var newEvent=new event_model({
                event_name:event_name,
                event_date:event_date,
                start_time:start_time,
                end_time:end_time,
                society:society,
                passcode:passcode,
                rules:rules_array
              });

              newEvent.save(function(err,docs){
                if(err){
                  callback({'error':true,'error_message':'Internal server error in saving event'});
                }
                callback({'error':false,'error_message':'Event added'});
              })
          }else{
              callback({'error':true,'error_message':'Event already exists'});
          }
        });

      }
      else{
        console.log(event_name);
        callback({'error':true,'error_message':'undefined values'});
      }
};
