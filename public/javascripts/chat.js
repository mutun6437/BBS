//グローバル変数　　汚染に気をつけよう


//現在表示されているチャットルーム
var currentTarget=undefined;
var rooms = [];

var selectedUser = undefined;





/////////////////
//ログプロパティ
////////////////

//取得するログの長さ
logLength　=10;




///グローバル
var chat,userName,thumNail;

//チャットメイン

var chatCtrl = function($scope,$http){

	$scope.setChatText = function(e){
		if (e.which == 13) {
		console.log("チャットを送信します");
   		 //$scope.comments.push($scope.newComment);
   		 createChatElement($scope.newComment,userName,0,thumNail);
   		 
   		 var storeData = {value:$scope.newComment,name:userName,target:selectedUser.innerHTML,thumNail:thumNail};   		 
   		 //console.log("ターゲット"+currentTarget);
   		 console.log("ここ何階？");
   		 currentTarget.emit("msg",storeData);   		 
   		 $scope.newComment = '';
  		}

	}

}

//DOM関係
function chatInit(){
	userParent = document.getElementById("chatSideArea");
	chat = document.getElementById("chatBody");

	thumnail = document.getElementById("_thumNail").innerHTML;


	//URLからユーザ名を取得
	userName=urls[1];
	console.log(userName);


	var fileInput = document.getElementById("chatFile");
	var file = document.getElementById('fileSender');

	file.addEventListener("click",function(){
		fileInput.click();
	});


	var callButton = document.getElementById("callButton");
	callButton.addEventListener("click",function(){
		callTo();
	});

}







//TODO チャット相手の選択
function changeChatTerget(e){
	//IE用
	if (!e)	e = window.event;
	
	//前に選択されていた要素を元に戻す
	if(selectedUser!=undefined){
		//console.log("あ"+selectedUser);
	　　　selectedUser.className = "chatUserName";
	}

	//チャットの中を初期化
	removeChatBody();

    //選択要素を更新
	selectedUser=e.target;
	//選択要素のクラス名を変更　　　　　　e.target=選択されたDOM
	e.target.className = "chatUserSelected";

	//クリックした時点でソケットをおくり個別ソケットを作成
	var nameArray = [userName,e.target.innerHTML];
 	nameArray.sort();

	var roomId = nameArray[0]+"-"+nameArray[1];
	console.log("room_Name"+roomId);
	socket.emit("createRoom",roomId,e.target.innerHTML);
	

	setTimeout(function(){
		//クリックしたターゲットからユーザ名を取得、検索ソケットを送りチャットを更新
		console.log("ログを検索します");
		currentTarget.emit("findChatLog",roomId);
	},100)

}

//chatLog検索ソケット





//Roomの接続ソケット
socket.on("connectRoom",function(roomId){
	console.log("roomID"+roomId.roomId);
	roomId = roomId.roomId;
	var targets = String(roomId).split("-");
	console.log("targets:"+targets[0]+targets[1]);
	if(targets[0]==userName||targets[1]){
		//接続相手がターゲットと同じであればRoomにはいります
		console.log("in a room");
		console.log("先に切断してから");
		var con = io.connect(domain+'/room/'+roomId);
		currentTarget = con;
		con = setEventRooms(con);
		rooms.push(con);
		//console.log("rooms"+rooms);
	}



});


function setEventRooms(con){
	con.on("msg",function(data){
		//チャットエリアに文字を追加
		console.log("ストア");
		//console.log("ストア"+data);
		//これまとめてもいいかも　2/2	
		createChatElement(data.value,data.name,1,data.thumNail);
	});

	con.on("sendFile",function(data){
		console.log("ファイルを受け取りました");
			//チャットエリアにぷっしゅ
		pushFileImage(data.data,data.type);
	});

	con.on("restoreChatLog",function(data){
		//チャットログを取得する
		//console.log("リストアデータ"+JSON.stringify(data));

		//チャットボディを初期化
		removeChatBody();

		//console.log("データ"+JSON.stringify(data));

		if(data[0]!==undefined){

			console.log("データ"+JSON.stringify(data));
			var Logs = [];
			for(i=0;i<logLength;i++){
				//Logs.push(data[0].chatLog[i]);
				if(data[0].chatLog[i]!==undefined){
					var direction;
					console.log("中身"+data[0].chatLog[i]);
					if(userName===data[0].chatLog[i].user){
						direction = 0;
					}else if(userName!==data[0].chatLog[i].user){
						direction = 1;
					}
					
					createChatElement(data[0].chatLog[i].comments,data[0].chatLog[i].user,direction,data[0].chatLog[i].thumNail);
				}else{
					console.log("そんなにログないよ");
				}
				
			}
			//console.log("ログ"+Logs);

		}else{
			//end 
			console.log("ログはありませn");
		}


	});


	con.on("callVideoChat",function(otherUserID){
	  console.log("電話がかかってきました"+otherUserID);
	  callVideoChat(otherUserID);      
    });

	con.on("stopCall",function(){
		//切断関数
		stopCall();
	});




	return con;
}




function removeChatBody(){
	for (var i =chat.childNodes.length-1; i>=0; i--) {
		console.log("チャット要素の削除");
		chat.removeChild(chat.childNodes[i]);
	}
}




function createChatElement(text,name,direction,src){

	var element = document.createElement("div");
	var thumElement = document.createElement("img");
	var chatElement = document.createElement("div");

	
	if(src==undefined){
		//console.log("noimage");
		thumElement.src="./images/noimage.gif";
	}else{
		thumElement.src=src;
	}

	thumElement.onload = function(){
		//console.log("ロー度");
		chatElement.appendChild(thumElement);
	}	

	if(direction==0){
		//自分
		element.className = "chatTexts chatTexts-0";
		thumElement.className = "thumNail-0";
	}else if(direction==1){
		//相手
		element.className = "chatTexts chatTexts-1";
		thumElement.className = "thumNail-1";
	}

	element.innerHTML = name+":<br>"+text;
	chatElement.appendChild(element);

	chatElement.style.height = "100px";

	chat.appendChild(chatElement);

	//自動でスクロールさせる
	go_bottom("chatBody");

}




/////////////////////////////////////////
//       チャットソケット
////////////////////////////////////////


/*
socket.on("msg",function(data){
	//チャットエリアに文字を追加
	console.log("ストア"+data);
	//これまとめてもいいかも　2/2	

	createChatElement(data.value,data.name,1,data.thumNail);
});





socket.on("sendFile",function(data){
	console.log("ファイルを受け取りました");
		//チャットエリアにぷっしゅ
	pushFileImage(data.data,data.type);
});
*/












var callMode = 0;

function changeCallUI(no){
	console.log("切り替え");
	if(no===0){
		var chatArea = document.getElementById("chatArea");
		chatArea.style.display="none";

		var chatArea = document.getElementById("callArea");
		chatArea.style.display="inherit";
		callMode = 1;
	}else if(no===1){
		var chatArea = document.getElementById("chatArea");
		chatArea.style.display="inherit";

		var chatArea = document.getElementById("callArea");
		chatArea.style.display="none";
		callMode =0;
	}

}









function go_bottom(targetId){
	//勝手にすくろーるさせる
    var obj = document.getElementById(targetId);
    if(!obj) return;
    obj.scrollTop = obj.scrollHeight;
}

















function fileSend(file){
	if(!file.files.length){
		return;//ファイルが選択されていなければ何もしない
	};
	console.log(file);

	//console.log(file.files[0].name);

	var extension = file.files[0].name.split(".");
	var type = fileType(extension[1]);

 	var fr = new FileReader();

 	fr.onload = function(e){
 		
 		var data = fr.result;

 		console.log("load"+data+"rype:"+type);

 		pushFileImage(data,type);

 		socket.emit("file receive",{data:data,type:type});
 	}
 	
 	fr.readAsDataURL(file.files[0]);

}






function pushFileImage(url,type){
	var fileLink = document.createElement("a");
	fileLink.href = url;
	fileLink.target = "_blank";


	var img = new Image();

	if(type == "file"){
		img.src = "./images/text.png";
	}else{
		img.src = "./images/text.png";
	}	

	fileLink.appendChild(img);

	img.onload = function(){
		chat.appendChild(fileLink);
	}

}




//ファイルタイプを返す
function fileType(ex){
	if(ex== "jpg"){
		return "image";
	}else if(ex == "js"){
		return "file";
	}

}




