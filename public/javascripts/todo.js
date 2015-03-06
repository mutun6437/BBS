///////////
//マウスイベント　動かすのができない　tasksにアクセス？　クリックの政府
////////


//TODO
//プロパティを読み込んで反映 LOAD
//
//


//クリックしているかどうか
var isClick = false;
//エディターモードかどうか
var isEdit = false;
//移動しているかどうか
var isMove = false;


function todoInit(){
	

	setTaskDate();
	
}






var todoCtrl = function($scope,$http){


	$scope.selectTask = undefined;

	

	$scope.tasks = [
	/*
		{"body":"do this 1","done":false,"click":false,"xPos":0,"yPos":20,"zIndex":0},
		{"body":"do this 2","done":false,"click":false,"xPos":0,"yPos":50,"zIndex":1},
		{"body":"do this 3","done":true,"click":false,"xPos":30,"yPos":20,"zIndex":2},
		{"body":"do this 4","done":false,"click":false,"xPos":30,"yPos":50,"zIndex":3}
	*/
	];








	$scope.addNew = function(){
		console.log($scope.newTaskBody);
		if($scope.newTaskBody==undefined){
			alert("内容を入力してください");
		}else{

			$scope.tasks.push({"body":$scope.newTaskBody,"done":false,"color":$scope.currentColor,"xPos":100,"yPos":100});
			//console.log($scope.tasks);
			$scope.newTaskBody = undefined;
		}
	}







	$scope.changeMode = function(index){
		console.log("1:"+index);

		if(isEdit){

			//document.getElementById("newEditer").style.display="none";
			//document.getElementById("afterEditer").style.display="inherit";
			
		}else{
			document.getElementById("newEditer").style.display="none";
			document.getElementById("afterEditer").style.display="inherit";
			isEdit =true;
			$scope.selectTask = index;
		}
		//対象のindexの処理

	}




	$scope.changeNew = function(){
		console.log("new mode");
		document.getElementById("afterEditer").style.display="none";
		document.getElementById("newEditer").style.display="inherit";
		isEdit = false;
	}










	//クリックすると前に出す関数
	$scope.front = function(index){	
		var max = 0;	
		for(i=0;i<$scope.tasks.length;i++){
			if($scope.tasks[i].zIndex>max){
				max = $scope.tasks[i].zIndex;
			}else{
				//console.log("最大値"+max);
			}
		}
		$scope.tasks[index].zIndex=max+1;
		document.getElementById("TODO"+index).style.zIndex=max+1;
		//console.log("max"+document.getElementById("TODO"+index).style.zIndex);
	}



	//付箋の移動関数
	$scope.move = function(e){
		//console.log(isClick);
		if(isClick){
			var target;
			for(i=0;i<$scope.tasks.length;i++){
				if($scope.tasks[i].click==true){
					target=i;
				}else{}
			}		

		//console.log(target);
		var _target = document.getElementById("TODO"+target);
		//_target.style.top=e.y-250+"px";
		//_target.style.left=e.x-480+"px";
		$scope.tasks[target].xPos = e.x-480+"px";
		$scope.tasks[target].yPos = e.y-250+"px";
		}else{
			

		}
	}

	
	//クリックしているかどうか
	$scope.mouseDown = function(index){
		$scope.tasks[index].click=true;
		isClick=true;
		//console.log("押した"+index+isClick);	
	}

	$scope.mouseUp = function(index){
		$scope.tasks[index].click=false;
		isClick=false;
		//console.log("離した"+index+isClick);		
	}











	$scope.colors =[
		{"color":"#808080","checked":true},{"color":"#0000FF","checked":false},{"color":"#00FFFF","checked":false},
		{"color":"#FFFF00","checked":false},{"color":"#FF0000","checked":false},{"color":"#800080","checked":false}
	];

	$scope.currentColor=$scope.colors[0].color;


	$scope.changeColor = function(index){
		if($scope.colors[index].checked==true){
			//同一の要素が選択された時
			return;
		}else{
			for(i=0;i<$scope.colors.length;i++){
				$scope.colors[i].checked=false;
			}
			//要素を選択
			$scope.colors[index].checked=true;
			$scope.currentColor=$scope.colors[index].color;
		}
	}



	/*afterEditer用カラーピッカー（要訂正）
		newEditerとの競合をさけるため
	*/

	$scope._colors =[
		{"color":"#808080","checked":true},{"color":"#0000FF","checked":false},{"color":"#00FFFF","checked":false},
		{"color":"#FFFF00","checked":false},{"color":"#FF0000","checked":false},{"color":"#800080","checked":false}
	];

	$scope._currentColor=$scope._colors[0].color;


	$scope._changeColor = function(index){
		console.log(index);
		if($scope._colors[index].checked==true){
			//同一の要素が選択された時
			return;
		}else{
			for(i=0;i<$scope.colors.length;i++){
				$scope._colors[i].checked=false;
			}
			//要素を選択
			$scope._colors[index].checked=true;
			$scope._currentColor=$scope._colors[index].color;
			$scope.tasks[$scope.selectTask].color=$scope._currentColor;
			console.log($scope.tasks);
		}
		

	}



	$scope.changeText = function (index) {
		console.log($scope.taskBody);
		if($scope.taskBody==undefined){
			console.log("内容がありません");
		}else{
			$scope.tasks[$scope.selectTask].body = $scope.taskBody;
		}
		
		console.log($scope.tasks);


	}




}


function setTaskDate(){
	var date = new Date();
	var year = setZeroDay(date.getFullYear());
	var month = setZeroDay(parseInt(date.getMonth())+1);
	var day = setZeroDay(date.getDate());
	



	var formattedDate = year + '-' + month+ '-' + day;
	document.getElementById("newTaskDay").value=formattedDate;
	console.log("日付を合わせます"+formattedDate);


}


function setZeroDay(num){

	if(String(num).length==1){
		num = "0"+num;
	}
	return num;
}