
/**
 * Module dependencies.
 */

var express = require('express')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , socketIO = require('socket.io');


//MongoDB
var MongoStore = require('connect-mongo')(express);

//var db = require('./model/database');

var model = require('./model/database.js'),
    User  = model.User;
var UserData = model.userData;

var chatLog = model.chatLog;

//起動時削除　＊＊＊＊後でなくす
User.remove({},function(err){console.log("削除エラー"+err)});
UserData.remove({},function(err){console.log("削除エラー"+err)});
//chatLog.remove({},function(err){console.log("削除エラー"+err)});







//Router
var routes = require('./routes');


//TODO 消す
console.log("削除しました");






//PassPort 
var flash = require("connect-flash")
  , passport = require("passport")
  , LocalStrategy = require("passport-local").Strategy;












var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  // -- 追加しところ --
app.use(express.cookieParser()); //追加
app.use(express.session({
    secret: 'secret',
    store: new MongoStore({
        db: 'session',
        host: 'localhost',
        clear_interval: 60 * 60
    }),
    cookie: {
        httpOnly: false,
        maxAge: new Date(Date.now() + 60 * 60 * 1000)
    }
})); //追加
  // -- 追加ココまで --
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});



app.get('/', routes.index);
app.get('/?id',routes.index);
app.get('/login', routes.login);
app.post('/add', routes.add);
app.get('/logout', function(req, res){
  req.session.destroy();
  console.log('deleted sesstion');
  res.redirect('/');
});

app.get('/report',function(req,res){
  res.render("report");
});



app.get('/user',routes.user);

app.get('/users', user.list);


//ログイン関係

















/*
## サーバ起動
##
*/
var server = http.createServer(app);
server.listen(app.get('port'),function(){
  console.log("Express server listening on port " + app.get('port'));
});


var io = socketIO.listen(server);



/*
##         Socket.io    
##　　　　　　　　　　　　　　　　の処理
##
##
*/

io.sockets.on('connection',function(socket){
  console.log("Socket connection");

  // メッセージを受けたときの処理
  /*
    socket.on('msg', function(data) {
      // つながっているクライアント全員に送信
      console.log("message:"+data);

      //チャットログをデータベースを保存
      pushChatLog(data);

      //これ全namespaceに送られそう
      socket.broadcast.emit('msg', data);
    });




    //FIle
    socket.on('file receive',function(data){
      console.log("ファイルを受け取りました",data);
      socket.broadcast.emit("sendFile",data);
    });

*/

    // クライアントが切断したときの処理
    socket.on('disconnect', function(){
      console.log("disconnect");
      //ログイン状態の切り替え（データベースに）

    });



    //////////////////////////////////////
    //        mongoDB                  //
    ////////////////////////////////////

    socket.on("findUserData",function(data){
      console.log("データを検索します"+data);
      UserData.find({},function(err,doc){
          console.log("検索結果:"+doc);
          socket.broadcast.emit("updateUserData",doc);
          socket.emit("updateUserData",doc);
          
        });
    });


    /////////////////////////////////////////
    //ユーザチャット
    /////////////////////////////////////////
    socket.on("createRoom",function(roomId,target){
      //console.log("Roomをつくります");
      createRoom(roomId);
      io.sockets.emit("connectRoom",{roomId:roomId,target:target});
    });


});


/*  Room 管理*/
var rooms = [];

function createRoom(roomId){
  console.log("Roomをつくります");
  //var room = {roomId:roomId,state:true};

  if(rooms.indexOf(roomId)===-1){
    console.log("作成する");
    rooms.push(roomId);
    io.of("/room/" + roomId).on("connection", chatSocket);
    
  }else{
    //ルームがすでに作られていれば
    console.log("既に作成されています"+rooms);
  }

  
  io.sockets.emit("connectRoom",roomId);
}


function chatSocket(socket){
  console.log("接続"+socket);
  
  socket.on('msg', function(data) {
    // つながっているクライアント全員に送信
    //console.log("message:"+data);
    console.log("message:");

    //チャットログをデータベースを保存
    pushChatLog(data);

    //warning これ全namespaceに送られそう
    socket.broadcast.emit('msg', data);
  });



  socket.on('file receive',function(data){
    console.log("ファイルを受け取りました",data);
    socket.broadcast.emit("sendFile",data);
  });

  socket.on("findChatLog",function(data){
    //console.log("リストアターゲット"+data);
    chatLog.find({user:data},function(err, doc){
      if(err || doc === null){return;}
      
      //ソケットに送信
        socket.emit("restoreChatLog",doc);
      });
  });


  socket.on("callRequest",function(id){
    console.log("電話がかかってきました"+id);
    socket.broadcast.emit("callVideoChat",id);
  });

  socket.on("stopCall",function(id){
    console.log("切断要求");
    socket.broadcast.emit("stopCall");
  });


  
};













function pushChatLog(data){
  //data value:メッセージ内容 name:送信者の名前
  //    　target:ターゲット　　　thumNamil:サムネイル画像

  var nameArray = [data.name,data.target];
  nameArray.sort();
  var LogName = nameArray[0]+"-"+nameArray[1];

  //console.log("保存先"+LogName);



  chatLog.find({user:LogName},function(err,doc){
    //console.log(err);
    if(!err){
      if(doc==""){
        //console.log("検索しました"+doc);
        //なければスキーマを作成
        //console.log("ログファイルを作成します。target:"+LogName);
        //ログスキーマ
        var newUserLog = new chatLog({user:LogName});

        //保存するログ配列の中身
        var logData = {user:data.name,comments:data.value,Date:new Date()};
        console.log(logData);
        
        //ログ配列にpush
        newUserLog.chatLog.push(logData);
        newUserLog.save();

      }else{
        //あればその配列にログをプッシュ
        //console.log("既存のログデータに保存します"+doc);
        var preData = doc[0];

        //保存するログ配列の中身
        var logData = {user:data.name,comments:data.value,Date:new Date()};
        //console.log(logData);
        doc[0].chatLog.push(logData);
        doc[0].save();

      }
    }else{

    }


  });




/*
  var data = JSON.stringify(data);
  console.log("da"+data);
*/





}