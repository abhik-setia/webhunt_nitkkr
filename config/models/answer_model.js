module.exports = function(connection){
  var mongoose=require('mongoose');
  var Schema = mongoose.Schema;
  require('mongoose-type-email');

  var answerSchema = new mongoose.Schema({
      event_name:String,
      user_email:mongoose.SchemaTypes.Email,
      answer_no:Number,
      answer:String,
      original_answer:String
     });

return connection.model('answers', answerSchema);
};
