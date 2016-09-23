var mongoose=require('mongoose');
var Schema = mongoose.Schema;

var eventSchema = mongoose.Schema({
     event_name:String,
     event_date:Date,
     start_time:Date,
     end_time:Date,
     society:String,
     passcode:String,
     rules:[String],
     questions:[{ type: Schema.Types.ObjectId, ref: 'questions' }],
     user_registered:[{ type: Schema.Types.ObjectId, ref: 'users' }]
    });

var db=mongoose.createConnection('mongodb://localhost:27017/webhunt');
module.exports = db.model('events', eventSchema);
