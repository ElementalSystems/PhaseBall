
   var canvasSize=100;
   var targetSize=20;
   var ballSize=10;
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
	board.canvas=c;	
	board.ctx = c.getContext("2d");
	board.frameNumber=0;
	board.ballLifeTime=10000;
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
	board.ammoDisplay=document.getElementById("ammodisplay");
	board.ammoTiles=board.ammoDisplay.getElementsByClassName("ammoframe");
	setUpAmmoBelt();
	aimGunAt(0,0);
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
	 var spd=Number(document.getElementById('speedctl').value);
	 ball.vx=-spd*Math.cos(board.fireAngle);
	 ball.vy=-spd*Math.sin(board.fireAngle);
	 ball_init.bind(ball)();
	 board.content.push(ball);	 	 
	 
	 board.ammoIndex+=1;
	 moveAmmoBelt();
   }
   
   function aimDown(e)
   {     
	   var x;
	   var y;
	   if (e.pageX || e.pageY) { 
		 x = e.pageX;
		 y = e.pageY;  
	   }
	   else { 
		 x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft; 
		 y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop; 
	   } 
	   x -= board.canvas.offsetLeft;
	   y -= board.canvas.offsetTop;
	   board.aimDragging=true;
       aimGunAt(x,y);
   }
   
   function aimUp(e)
   {
     board.aimDragging=false;
   }
   
   function aimDrag(e)
   {
      if  (board.aimDragging)
	    aimDown(e);	  
   }
   
   function aimGunAt(x,y)
   {
      //calc the anglect
	  x=canvasSize-x;
	  y=canvasSize-y;
	  board.fireAngle=Math.atan2(y,x);
      board.gun.style.transform="translate(50%,50%) rotate("+board.fireAngle+"rad)";	
   }
   
   
   function setUpAmmoBelt()
   {
      for (var i=0;i<board.ammoTiles.length;i+=1){
	    if (i<board.balls.length) {
		   board.ammoTiles[i].style.display='block';
		   board.ammoTiles[i].style.background=buildAmmoGradient(board.balls[i]);
		} else {
		   board.ammoTiles[i].style.display='none';
		}
	  }
	  board.ammoIndex=0;
	  moveAmmoBelt();
   }
   
   function buildAmmoGradient(phaseSeq)
   {
      var ret='linear-gradient(to bottom, #000,#000';
	  for (var i=0;i<phaseSeq.length;i+=1) {
	    var col="#CCC";
	    switch (phaseSeq.charAt(i)) {
		  case  'r': col="#C00"; break;
		  case  'b': col="#00C"; break;		  
		}
		ret=ret+','+col+','+col;
	  }
	  ret=ret+',#000,#000)'
	  return ret;
   }
   
   function moveAmmoBelt()
   {
      board.ammoDisplay.scrollLeft=board.ammoDisplay.scrollWidth-board.ammoDisplay.offsetWidth-board.ammoIndex*board.ammoTiles[0].offsetWidth;      	  
   }