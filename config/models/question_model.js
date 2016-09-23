
//var db=mongoose.createConnection('mongodb://localhost:27017/webhunt');
module.exports = function(connection){
  var mongoose=require('mongoose');
  var Schema = mongoose.Schema;
  //require('./event_model');

  var option_schema=new Schema({
    option_no:Number,
    option_answer:String
  });

  var questionSchema=new Schema({
    event_id:{ type: Schema.Types.ObjectId, ref:'events'},
    event_name:String,
    question_no:Number,
    question:String,
    answer:String,
    options:[option_schema]
  });

  return connection.model('questions', questionSchema);
};
