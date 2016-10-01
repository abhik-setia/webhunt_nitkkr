var mongoose=require('mongoose');
var MongoClient=require('mongodb').MongoClient;
var conn_new_app = mongoose.createConnection('mongodb://localhost/webhunt');
var user_model=require('./models/user_model')(conn_new_app);
var question_model=require('./models/question_model')(conn_new_app);
var event_model=require('./models/event_model')(conn_new_app);

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
                setInterval(function(){

                    var date=new Date();

                    if(Date.parse(date)>=Date.parse(start_time) && Date.parse(date) <=Date.parse(end_time)){
                      event_model.update({event_name:event_name},{ $set : { active : 1} },function(err,docs){
                        if(err)
                        console.log(err);
                      });
                    //  console.log('active');
                    }else{
                      event_model.update({event_name:event_name},{ $set : { active : 0} },function (err,docs) {
                        if(err)
                        console.log(err);
                      });
                    //  console.log('inactive');
                    }
                    }, 1000);
                callback({'error':false,'error_message':'Event added'});
              });
          }else{
              callback({'error':true,'error_message':'Event already exists'});
          }
        });

      }
      else{
        callback({'error':true,'error_message':'undefined values'});
      }
};

exports.getEvent=function(event_name,callback){
  if(event_name!=null||event_name!=undefined){
    event_model.findOne({event_name:event_name}).populate('questions user_registered').exec(function(err,docs){

        if(docs!=null){
          callback(docs);
        }else{
          callback({'error':true,'error_message':'Event not found'});
        }
    });
  }else{
    callback({'error':true,'error_message':'undefined values'});
  }
};
exports.addQuestion=function(event_name,event_id,question_no,question,answer,callback){
  if(event_name!=null||event_name!=undefined){

    question_model.find({ $and : [ { event_id:event_id},{question_no:question_no } ]  }).exec(function(err,docs){

        if(docs==null||docs.length==0){
            var newQuestion=new question_model({
              event_id:event_id,
              event_name:event_name,
              question_no:question_no,
              question:question,
              answer:answer
            });

            newQuestion.save(function(err,docs){
              if(err){

                callback({'error':true,'error_message':'Internal server error in saving event'});
              }

              event_model.findByIdAndUpdate({_id:event_id},{$push :{questions:docs._id}},function(err,docs){
                if(err)
                {
                  console.log(err);
                  callback({'error':true,'error_message':'Failed to update event array'});
                }else{
                  console.log(docs);
                  callback({'error':false,'error_message':'Question added'});
                }
              });

            });

        }else{
              question_model.update({ $and : [ { event_id:event_id},{question_no:question_no } ]  },
                { $set : { question_no :question_no,question:question,answer:answer}},function(err,result){
                  if(err)
                  {
                    console.log(err);
                    callback({'error':true,'error_message':'Failed to update event array'});
                  }else{
                    console.log(result);
                    callback({'error':false,'error_message':'Question updated'});
                  }
                }
              );
          }

        });

}else{
    callback({'error':true,'error_message':'undefined values'});
  }
}
