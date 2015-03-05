if(typeof(webkitAudioContext)!=="undefined")
    var audioctx = new webkitAudioContext();
else if(typeof(AudioContext)!=="undefined")
    var audioctx = new AudioContext();

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;


  var myStream;

  //ローカルAPI SKYWAY https://skyway.io/ds/
  var peer = new Peer({key: 'f5cbb124-7912-412a-89fe-13af07b6ad0c'});
  //

  //自分のpeerID
  var myPeerId;
  //接続されているpeer
  var connectedPeer = null;



  peer.on('open', function(id){
  	console.log("Peerを確立");
    myPeerId=id;
  });

  peer.on('call', function(call){
  	console.log("着信");
  	connectedPeer=call;
    call.answer(myStream);
    call.on('stream', setOthersStream);
  });

  peer.on('error', function(e){
    console.log("エラー"+e.message);
  });
  
  peer.on("connection",function(e){
  	console.log("接続しました");
  });




  var setOthersStream = function(stream){
  	var video = document.createElement("video");
  	video.id = "others-video";
  	video.src=URL.createObjectURL(stream);
  	video.autoplay = true;

  	document.getElementById("callBody").appendChild(video);

    //$('#others-video').prop('src', URL.createObjectURL(stream));

  };

  var setMyStream = function(stream){
    myStream = stream;
    //$('#video').prop('src', URL.createObjectURL(myStream));
  };




function stopCall(){
	//UIをもとにもどします
	changeCallUI(1);

	if(connectedPeer) {
		 console.log("切断します");
	     connectedPeer.close();
	     connectedPeer = null;
	}
}





function videoChatInit(){
	//ストリームを取得する関数
	navigator.getUserMedia({audio: true,video:true}, setMyStream, function(){});
	
}


function callVideoChat(otherUserID){
	console.log("相手側から送ります");
	var call = peer.call(otherUserID, myStream);
	changeCallUI(0);
	connectedPeer=call;
	call.on('stream', setOthersStream);
}


function callTo(){
	changeCallUI(0);
	console.log("電話をかけます"+selectedUser.innerHTML);
	currentTarget.emit("callRequest",myPeerId);

}


function stopVideoChat(){
	stopCall();
	currentTarget.emit("stopCall");
}


