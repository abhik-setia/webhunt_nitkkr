module.exports = function(connection){

var mongoose=require('mongoose');
var Schema = mongoose.Schema;
// require('./question_model');
// require('./user_model');

var eventSchema = new Schema({
     event_name:String,
     event_date:Date,
     start_time:Date,
     end_time:Date,
     duration:String,
     society:String,
     passcode:String,
     rules:[String],
     active:{type:Number,default:0},
     questions:[{ type: Schema.Types.ObjectId, ref: 'questions' }],
     user_registered:[{ type: Schema.Types.ObjectId, ref: 'users' }]
    });

//var db=mongoose.createConnection('mongodb://localhost:27017/webhunt');
return connection.model('events', eventSchema);
};
