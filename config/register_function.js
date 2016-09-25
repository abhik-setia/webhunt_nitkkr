var mongoose=require('mongoose');
var MongoClient=require('mongodb').MongoClient;

var conn_new_app = mongoose.createConnection('mongodb://localhost/webhunt');
var user_model=require('./models/user_model')(conn_new_app);
var question_model=require('./models/question_model')(conn_new_app);
var event_model=require('./models/event_model')(conn_new_app);

exports.registerUser=function(event_name,user_name,user_roll_no
  ,user_branch,user_year,user_email,user_phone_no,callback){


      if((event_name!=null && user_email!=null)||
      (event_name!=undefined && user_email!=undefined)){

        user_model.find( { $or : [  { $and :[ { user_email:user_email } , { event_name:event_name } ] },
          { $and :[ { user_roll_no:user_roll_no } , { event_name:event_name } ] },
          { $and :[ { user_phone_no:user_phone_no } , { event_name:event_name } ] } ] } )
        .exec(function(err,docs){

          if(docs==null||docs.length==0){


            var newUser=new user_model({
              event_name:event_name,
              user_name:user_name,
              user_roll_no:user_roll_no,
              user_branch:user_branch,
              user_year:user_year,
              user_email:user_email,
              user_phone_no:user_phone_no
            });

            newUser.save(function(err,docs){
              if(err){
                callback({'error':true,'error_message':'Internal server error in saving user'});
              }
              event_model.update({event_name:event_name},{ $push : { user_registered : docs._id } },function(err,docs){
                if(err)
                {
                  console.log(err);
                  callback({'error':false,'error_message':'Failed to update event array'});
                }else{
                  //console.log(docs);
                    callback({'error':false,'error_message':'user registered','register_status':false});
                }
              });

            });

          }else{
            callback({'error':false,'error_message':'user already registered','register_status':true});
          }

        });

      }
      else{
        callback({'error':true,'error_message':'undefined values'});
      }
};
