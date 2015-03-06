





//変数の初期化やDOMの初期化に使います
var onlineUser = [];

var userIndex = 0;
var userParent=undefined;

window.onload = function(){
	todoInit();
	UIInit();
	videoChatInit();
	chatInit();
	dataUpdate();	

}



function dataUpdate(){
	//ユーザデータのアップデート
	console.log("データの検索");
	socket.emit("findUserData",userName);

}



socket.on("updateUserData",function(data){
	//console.log("ユーザ"+JSON.stringify(data[0]));
	onlineUser=data;

	//インデックスを削除
	userIndex = 0;

	//ユーザデータの親要素
	
	console.log("削除");
	//先にすべての子要素の削除
	for (var i =userParent.childNodes.length-1; i>=0; i--) {
		console.log("要素の削除"+data);
		userParent.removeChild(userParent.childNodes[i]);
	}

	createUserElement(data);

	//データベースから取得したデータを反映
	
});



function createUserElement(data){
	
	console.log(JSON.stringify(data));
	//console.log("email"+data[0].email);
	//console.log(userIndex);
	//console.log("要素"+data[userIndex]);
	



		//親要素　imgとnamespaceの入れ子
		var el = document.createElement("div");
		el.className="chatUser";
		el.addEventListener("click",changeChatTerget);

		//子要素　ユーザ名
		var ns = document.createElement("div");
		ns.className = "chatUserName";

		//console.log("dadada");

		//data = JSON.stringify(data[userIndex]);
		
		console.log("data"+data+"index"+userIndex);

		if(data[userIndex].userName == undefined){
			ns.innerHTML = data[userIndex].email;
		}else{
			ns.innerHTML = data[userIndex].userName;
		}

		var img = new Image();

		//console.log("Index");
		if(data[userIndex].thumnail===undefined){
			//console.log("noimage");
			img.src="./images/noimage.gif";
		}else{
			img.src=data[userIndex].thumnail;
		}

		img.style.float = "left";

		img.className = "chatUserThum";

		img.onload = function(){
			console.log("ユーザがきました"+data[userIndex].email);
			el.appendChild(img);
			el.appendChild(ns);
			
			if(!isOwner(ns.innerHTML)){
				userParent.appendChild(el);
			}
			


			userIndex++;
			if(userIndex<data.length){
				createUserElement(data);
			}
		}
		

		}





function isOwner(name){
	//ユーザ名が同じであればtrueを返す
	//console.log(name);
	if(name===userName){
		return true;
	}else{
		return false;
	}
}



