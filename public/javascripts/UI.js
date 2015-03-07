/* 
 			MENU
*/

function UIInit(){
	//console.log("da");
/*　　メニューバー  */
	var menu = document.getElementsByClassName("menu");
	//console.log(menu);
	for(i=0;i<menu.length;i++){		
		menu[i].addEventListener("click",function(e){
			for(i=0;i<menu.length;i++){
				//先に全部をオフにしてから
				menu[i].className=e.target.className="menu menuOff";
			}
			//オンにする
			e.target.className="menu menuOn";

			if(e.target.innerHTML=="TODO"){
				console.log("TODO");
				document.getElementById("todo-contents").style.display="inherit";
				document.getElementById("chatContents").style.display="none";
			}else if(e.target.innerHTML=="Chat"){
				document.getElementById("todo-contents").style.display="none";
				document.getElementById("chatContents").style.display="inherit";
			}
		},false);
	}

////////////////////////////////////////////////////////////////
}





function changeDrawingUI(num){
	if(num==0){
		//キャンバスを下に
		document.getElementById("todoArea").style.zIndex=2;
		canvas.style.zIndex=1;


	}else if(num == 1){
		document.getElementById("todoArea").style.zIndex=1;
		canvas.style.zIndex=2;
	}

}



