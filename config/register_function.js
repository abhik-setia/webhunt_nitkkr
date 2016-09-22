var mongoose=require('mongoose');
var MongoClient=require('mongodb').MongoClient;

var user_model=require('./models/user_model');

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

            newUser.save(function(err){
              if(err){
                callback({'error':true,'error_message':'Internal server error in saving user'});
              }
              callback({'error':false,'error_message':'user registered'});
            });

          }else{
            callback({'error':true,'error_message':'user already registered'});
          }

        });

      }
      else{
        callback({'error':true,'error_message':'undefined values'});
      }
};
