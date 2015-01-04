
   var canvasSize=100;
   var board=null;
   
   function updateBoard()
   {
    var content=document.getElementById("levelCode").value;
	var c = document.getElementById("myCanvas");
	canvasSize=c.width;
	board=null;
	try {
  	  board=jsonParseWithInitiator(content);
	} 
	catch (err) {
	  document.getElementById("parseStatus").innerHTML=err.toString();
	  return;
	}
	board.ctx = c.getContext("2d");
	board.frameNumber=0;
	document.getElementById("parseStatus").innerHTML="Okay";		
   }
   
   function start()
   {
      updateBoard();
      window.requestAnimationFrame(gameTick);
	
   }
   
   function gameTick(timestamp) 
   {
    if (board) {
      //lets calculate some basics
	  if (board.frameNumber==0) { //first frameNumber
	    board.frameStart=timestamp-50;		
		board.gameStart=timestamp;
	  }
	  board.worldTime=timestamp;
	  board.frameTime=board.worldTime-board.frameStart;
	  board.frameNumber+=1;
	  board.gameTime=board.worldTime-board.gameStart;
      board.frameStart=timestamp;		
	  
	  //let the objects have their ticks
	  for (var i=0;i<board.content.length;i+=1) {
	    board.content[i].tick();
	  }	
	
	  //now do the redraw
	  board.ctx.fillStyle = '#CC5';
	  board.ctx.globalAlpha=0.1;
	  board.ctx.fillRect(0,0,canvasSize,canvasSize);
	  board.ctx.globalAlpha=1;
	
	  for (var i=0;i<board.content.length;i+=1) {
	    board.content[i].draw();
	  }	
	
	}
	window.requestAnimationFrame(gameTick);
   }
   
   function checkHits(x1,y1,x2,y2)
   {
      var result=[];
      for (var i=0;i<board.content.length;i+=1) {
	    var res=board.content[i].checkHit(x1,y1,x2,y2);
		if (res) result.push(res);		
	  }	
	  if (result.length==0) return null;
	  return result;
   }