var mongoose=require('mongoose');
var Schema = mongoose.Schema;

var questionSchema=mongoose.Schema({
  question_no:Number,
  question:String,
  answer:String
});


var eventSchema = mongoose.Schema({
     event_name:String,
     event_date:Date,
     start_time:Date,
     end_time:Date,
     society:String,
     passcode:String,
     rules:[String],
     questions:[questionSchema],
     user_registered:[{ type: Schema.Types.ObjectId, ref: 'users' }]
    });

var db=mongoose.createConnection('mongodb://localhost:27017/webhunt');
module.exports = db.model('events', eventSchema);
