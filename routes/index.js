var model = require('../model/database.js'),
    User  = model.User;
var UserData = model.userData;


/*
 * GET home page.
 */

exports.index = function(req, res){
		//TODO 必要なデータだけ送るようにする
		//


  	
  		

      UserData.find({email:req.session.user},function(err,doc){
        if(!err){
          console.log(doc);
          if(doc!=""){
            console.log("中身:"+doc);
            res.render('index', { title: 'Express',userData:doc[0]});
          }else{
            res.redirect("/login");
          }
          
        }else{
          res.redirect("/login");
        }
      });




/*

  		if(UserData!=undefined){
  			//ログインしていれば
  			res.render('index', { title: 'Express',userData:UserData});
  		}else{
  			//ログインしていなければ
  			res.redirect("/login");
  		}
*/


};

/*
 * GET login
 */

exports.login = function(req, res){
    var email    = req.query.email;
    var password = req.query.password;

/*
    User.find({},function(err,doc){
      console.log(doc);
    });
*/

    var query = { email: email,password:password};
    User.find(query, function(err, data){
      //console.log("データ："+data);
        if(err){
            console.log("ログインエラー"+err);
        }
        if(data == ""){
            console.log("なかった");
            res.render('login');
        }else{
          //User.find({},);

            req.session.user = email;
            res.redirect('/?'+email);
        }
    });
};


/*ユーザー登録機能*/
exports.add = function(req, res){
    //console.log("保存"+JSON.stringify(req.body));


    var newUser = new UserData({email:req.session.user});
    var newLoginUser = new User(req.body);


    //すでにとうろくされていないか
    console.log("ddd"+req.body.email);

    User.find({email:req.body.email},function(err,doc){
      console.log("add"+doc);
      if(!err){

          if(doc==""){
            //検索しても見つからない
            console.log("新規登録します");

            newUser.save(function(err){
                if(err){

                }else{
                  console.log("ユーザデータの作成");
                }
            });



            newLoginUser.save(function(err){
              if(err){
                  console.log("新規登録エラー"+err);
                  res.redirect('back');
              }else{
                  console.log("ログイン完了");
                  req.session.user = newUser.email;
                  res.redirect('/?'+newUser.email);
              }
            });


          }else{
            console.log("既に登録されているのでリダイレクトします"+newUser.email);
            req.session.user = newUser.email;
            res.redirect('/?'+newUser.email);           

          }
     

      }else{
        console.log("新規登録エラー.index.jsのaddを参照");
        

      }

    });

    

    


    

    
};




exports.user = function(req,res){
	var userId = req.params.id;
	
	User.find({},function(err,docs){
		//console.log(docs[0]);
		res.render('user',{userData:docs[0]});
	});

	
}


