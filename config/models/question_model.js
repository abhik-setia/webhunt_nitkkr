var mongoose=require('mongoose');
var Schema = mongoose.Schema;

var questionSchema=mongoose.Schema({
  event_id:{ type: Schema.Types.ObjectId, ref:'events'},
  event_name:String,
  question_no:Number,
  question:String,
  answer:String
});

var db=mongoose.createConnection('mongodb://localhost:27017/webhunt');
module.exports = db.model('questions', questionSchema);
