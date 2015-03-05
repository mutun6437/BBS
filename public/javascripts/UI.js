/* 
 			MENU
*/

function UIInit(){
	console.log("da");





/*　　メニューバー  */
	var menu = document.getElementsByClassName("menu");
	console.log(menu);

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









