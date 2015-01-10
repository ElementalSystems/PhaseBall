
   var canvasSize=100;
   var board=null;
   
   function updateBoard()
   {
    var content=document.getElementById("levelCode").value;
	var c = document.getElementById("gamecanvas");
	canvasSize=c.offsetWidth;
	c.width=canvasSize;
	c.height=canvasSize;
	
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
	board.backdropSource=document.getElementById('backdrop');	
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
	  board.ctx.globalAlpha=0.3;
	  //board.ctx.fillRect(0,0,canvasSize,canvasSize);
	  board.ctx.drawImage(board.backdropSource,0,0,canvasSize,canvasSize);
	  board.ctx.globalAlpha=1;
	
	  for (var i=0;i<board.content.length;i+=1) {
	    board.content[i].draw();
	  }	
	
	}
	window.requestAnimationFrame(gameTick);
   }
   
   function checkHits(x1,y1,x2,y2,world)
   {
      var result=[];
	  if (world==undefined) world='white';
      for (var i=0;i<board.content.length;i+=1) {
	    if (!worldsInteract(world,board.content[i].world)) continue;
	    var res=board.content[i].checkHit(x1,y1,x2,y2);
		if (res) result.push(res);		
	  }	
	  if (result.length==0) return null;
	  return result;
   }
   
   function worldsInteract(w1,w2)
   {
     if (w1=='white') return true;
	 if (w2=='white') return true;
	 return w1==w2;
   }
   
   function fireGun()
   {
     var ball={ x:98, y:98 };
	 var spd=Number(document.getElementById('speedctl').value);
	 var ang=Number(document.getElementById('anglectl').value)*Math.PI/180;
	 ball.vx=-spd*Math.cos(ang);
	 ball.vy=-spd*Math.sin(ang);
	 ball_init.bind(ball)();
	 board.content.push(ball);	 	 
   }