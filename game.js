
   var canvasSize=100;
   var targetSize=20;
   var maxFireSpd=80;
   var ballSize=10;
   var board=null;
   
   function fitBoard()
   {
	   setElementClass(document.getElementById('hinttext'),'hidden');	  
 	
	   var size=window.innerWidth; //the etire width
	   var height=window.innerHeight*4/5; //and 80% of thr height
	   if (size>height) size=height; //take the lesser of the two
	   
	   document.getElementById('playarea').style.width=size+'px';
	   document.getElementById('boardarea').style.height=size+'px';	   
	   document.getElementById('ctlarea').style.height=(window.innerHeight-size)+'px';	   
	   document.getElementById('levelselector').style.width=size+'px';	   
	   document.getElementById('levelselector').style.left=((window.innerWidth-size)/2)+'px';	   
	   document.getElementById('titlelogo').style.right=(size+(window.innerWidth-size)/2)+'px';	   
	   
	   
	   var edit=getUrlVars()["edit"];
	   var play=getUrlVars()["play"];
	   var content;
	   if (edit) {
	     document.getElementById("editor").style.display = "block";
		 content=document.getElementById("levelCode").value;
		 updateBoard(content);
	   } else if (play) {
	     content=document.getElementById(play).innerHTML;
		 updateBoard(content);
	   } 
       
   }
   
   function updateBoard(content)
   {
	setElementClass(document.getElementById('levelselector'),'hidden');	  
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
	board.canvas=c;	
	board.ctx = c.getContext("2d");
	board.frameNumber=0;
	board.ballLifeTime=5000;
	//add the walls
	board.content.push(
	  createLine(-1,-1,101,-1,"white"),
	  createLine(-1,-1,-1,101,"white"),
	  createLine(101,-1,101,101,"white"),
	  createLine(-1,101,101,101,"white")
	  );

	document.getElementById("parseStatus").innerHTML="Okay";		
	board.backdropSource=document.getElementById('backdrop');	
	board.gun=document.getElementById('gun');	
	board.spddial=document.getElementById('spddial');	
	board.spdneedle=document.getElementById('spdneedle');	
	board.ammoDisplay=document.getElementById("ammodisplay");
	board.ammoTiles=board.ammoDisplay.getElementsByClassName("ammoframe");
	setUpAmmoBelt();
	aimGunAt(0,0);
	spdAt(0,0);
	board.hinttext=document.getElementById('hinttext');	
	fireHintEvent("start");
   }
   
   function start()
   {
	  fitBoard();
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
	  
	  board.killList=[];
	  //let the objects have their ticks
	  for (var i=0;i<board.content.length;i+=1) {
	    board.content[i].tick();
	  }
      
	  //remove any objects that have requested death
	  for (var i=0;i<board.killList.length;i+=1) 
	    board.content.splice(board.content.indexOf(board.killList[i]), 1);	  
      
	  //now do the redraw
	  board.ctx.fillStyle = '#CC5';
	  board.ctx.globalAlpha=.2;
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
     var ball={ x:99.9, y:99.9,
	   phasePlan: board.balls[board.ammoIndex] };
	 ball.vx=-board.fireSpd*Math.cos(board.fireAngle);
	 ball.vy=-board.fireSpd*Math.sin(board.fireAngle);
	 ball_init.bind(ball)();
	 board.content.push(ball);	 	 
	 fireHintEvent("fire");
	 
	 board.ammoIndex+=1;
	 moveAmmoBelt();
	 
   }
   
   
   window.ondragstart = function() { return false; } 

