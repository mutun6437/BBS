var mongoose = require('mongoose');
var url = 'mongodb://localhost/user';
var db  = mongoose.createConnection(url, function(err, res){
    if(err){
        console.log('Error connected: ' + url + ' - ' + err);
    }else{
        console.log('Success connected: ' + url);
    }
});

// Modelの定義
var UserSchema = new mongoose.Schema({
    email    : String,
    password  : String
},{collection: 'info'});

exports.User = db.model('User', UserSchema);



var UserDataSchema = new mongoose.Schema({
    email:String,
    userName: String,
    isLogin : Boolean,
    thumnail:String
});


exports.userData = db.model('userData', UserDataSchema);



var textLog = new mongoose.Schema({
    user     : String,
    comments  : String,
    Date:Date
});



var chatLogSchema = new mongoose.Schema({
    user:String,
    chatLog:[textLog]
});


exports.chatLog = db.model('chatLog',chatLogSchema);




 


