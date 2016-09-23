
//var db=mongoose.createConnection('mongodb://localhost:27017/webhunt');
module.exports = function(connection){
  var mongoose=require('mongoose');
  var Schema = mongoose.Schema;
  require('mongoose-type-email');

  var userSchema = new mongoose.Schema({
      event_name:String,
      user_name:String,
      user_roll_no:String,
      user_branch:String,
      user_year:Number,
      user_email:mongoose.SchemaTypes.Email,
      user_phone_no:Number
     });

return connection.model('users', userSchema);
};
