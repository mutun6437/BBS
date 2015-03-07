//canvas context
var canvas,ctx;


//描画可能かどうか
var isDrawing = false;
//ペンが降りているかどうか
var isDrawDown = false;
//どんな描画タイプか
var drawType = 0;//0:pencil 

var mouseX,mouseY;



function canvasInit(){
	canvas = document.getElementById("todoCanvas");
	ctx = canvas.getContext("2d");
	//changeDrawing();

	ctx.strokeStyle='#000000';
	ctx.lineWidth = 0.1;

}


function setDrawEvent(mode){
	//TODO DrawイベントのON/OFF
	if(mode == 0){
		canvas.removeEventListener("mouseup", isMouseDown, false);
		canvas.removeEventListener("mousedown", isMouseDown, false);
		canvas.removeEventListener("mousemove", drawCanvas, false);
	}else　if(mode == 1){
		canvas.addEventListener("mousedown", isMouseDown, false);
		canvas.addEventListener("mouseup", isMouseDown, false);
		canvas.addEventListener("mousemove", drawCanvas, false);
	}
}




function drawCanvas(e){
	
	var parent = canvas.parentNode;
	
	adjustXY(e);

	//console.log(xPos+"***"+yPos);

	if(isDrawing){
		if(isDrawDown){
			console.log("描画");
			ctx.lineTo(mouseX, mouseY);
			ctx.stroke();
		}else{
			//何もしない
			console.log("何もしない");
		}
	}else{
		//何もしない
		console.log("何もしない");
	}

}


function adjustXY(e) {
		var rect = e.target.getBoundingClientRect();
		mouseX = (e.clientX - rect.left);
		mouseY = (e.clientY - rect.top);
	}





function isMouseDown(e){
	var parent = canvas.parentNode;

	adjustXY(e);

	if(e.type=="mousedown"){
		console.log("ペンを入れます");		
		//描画開始
		ctx.beginPath();
        ctx.moveTo(mouseX, mouseY);
        isDrawDown = true;
	}else　if(e.type=="mouseup"){
		console.log("ペンを離します");
		//描画終了
		ctx.lineTo(mouseX, mouseY);
        ctx.stroke();
        ctx.closePath();		
		isDrawDown = false;
	}
}






function changeDrawing(){
	if(isDrawing){
		//OFFに
		console.log("オフにします");
		setDrawEvent(0);
		changeDrawingUI(0);
		isDrawing = false;
	}else{
		//ONに
		console.log("オンにします");
		setDrawEvent(1);
		changeDrawingUI(1);
		isDrawing = true;
	}
}