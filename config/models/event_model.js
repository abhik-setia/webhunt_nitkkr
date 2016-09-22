var mongoose=require('mongoose');
var Schema = mongoose.Schema;

var questionSchema=mongoose.Schema({
  question_no:Number,
  question:String,
  answer:String
});

var user_register=mongoose.Schema({
  
})

var eventSchema = mongoose.Schema({
     name:String,
     event_date:Date,
     questions:[questionSchema]
   });

mongoose.connect('mongodb://localhost:27017/webhunt');
module.exports = mongoose.model('events', eventSchema);
