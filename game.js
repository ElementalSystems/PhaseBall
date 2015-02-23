
   var canvasSize=100;
   var targetSize=20;
   var maxFireSpd=80;
   var ballSize=10;
   var board=null;
   var levNumber=9;
   var editMode=0;
   
   
   function start()
   {
	   
	  unsetElementClass(document.getElementById('playarea'),'hidden');	  
 	  fitBoard();
	  setElementClass(document.getElementById('hinttext'),'hidden');	  
 	  
	   var edit=getUrlVars()["edit"];
	   if (edit) {
		 editMode=1;
	     document.getElementById("editor").style.display = "block";
		 content=document.getElementById("levelCode").value;
		 updateBoard(content);
	   }	  
      window.requestAnimationFrame(gameTick);	
	  showChapter(0);
   }
   
   function fitBoard()
   {
	   
	   var size=window.innerWidth; //the etire width
	   var height=window.innerHeight*4/5; //and 80% of thr height
	   if (size>height) size=height; //take the lesser of the two
	   
	   document.getElementById('playarea').style.width=size+'px';
	   document.getElementById('boardarea').style.height=size+'px';	   
	   document.getElementById('ctlarea').style.height=(window.innerHeight-size)+'px';	   
	   document.getElementById('levelselector').style.width=size+'px';	   
	   document.getElementById('levelselector').style.left=((window.innerWidth-size)/2)+'px';	   
	   document.getElementById('gamesummary').style.width=size+'px';	   
	   document.getElementById('gamesummary').style.left=((window.innerWidth-size)/2)+'px';	   
	   document.getElementById('titlelogo').style.right=(size+(window.innerWidth-size)/2)+'px';	   	
   }
   
   function startLevel(levEl)
   {
	  
	  var levN=levEl.getAttribute('data-lev');
	  ga('send', 'event', 'StartLevel'+levN);
	  levNumber=levN;
      content=document.getElementById('lev'+levNumber).innerHTML;
	  if (editMode) 
		  document.getElementById("levelCode").innerHTML=content;	  
	  updateBoard(content);   
   }
   
   function editorUpdate()
   {
	  var content=document.getElementById("levelCode").value;	  
	  updateBoard(content);   
   }
   
   
   var medal_name=["never","none","Bronze","Silver","Gold"];
   
   function showChapter(num)
   {
	   setElementClass(document.getElementById('gamesummary'),'hidden');	  
 	   unsetElementClass(document.getElementById('chapter0'),'active');
	   unsetElementClass(document.getElementById('chapter1'),'active');
	   unsetElementClass(document.getElementById('chapter2'),'active');
	   unsetElementClass(document.getElementById('chapter3'),'active');
	   //unsetElementClass(document.getElementById('chapter4'),'active');
	   var chapterE=document.getElementById('chapter'+num);
	   setElementClass(chapterE,'active');	   
	   var links=chapterE.getElementsByClassName('levlink');
	   for (var i=0;i<links.length;i+=1) {
		   var link=links[i];
		   unsetElementClass(link,'Gold');
		   unsetElementClass(link,'Silver');
		   unsetElementClass(link,'Bronze');
		   unsetElementClass(link,'none');
		   var levN=link.getAttribute('data-lev');
		   var lev=parseInt(localStorage.getItem('levcoding'+levN));
		   if (lev>0)
		     setElementClass(link,medal_name[lev]);		   
	   }
	   
	   unsetElementClass(document.getElementById('levelselector'),'hidden');	   	   
   }
   
   function updateBoard(content)
   {
	setElementClass(document.getElementById('levelselector'),'hidden');	  
 	setElementClass(document.getElementById('gamesummary'),'hidden');	  
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
	board.fireButton=document.getElementById("firebutton");
	unsetElementClass(board.fireButton,'inprogress');	 	    
	board.targetCount=0;
	for (var i=0;i<board.content.length;i+=1) 
		if (board.content[i].targetCount)
           board.targetCount+=board.content[i].targetCount;
	setUpAmmoBelt();
	aimGunAt(0,0);
	spdAt(0,0);
	board.targetHit=0;
	board.hinttext=document.getElementById('hinttext');	
	fireHintEvent("start");
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
	
	  for (var i=0;i<board.content.length;i+=1) 
	    board.content[i].draw();
	  
	  if (board.ended) {
		fireHintEvent('kill');
		showGameSummary();	  
		board=null;
	  }
	}
	window.requestAnimationFrame(gameTick);   
}

function showGameSummary()
{
	var newCoding=0;
    unsetElementClass(document.getElementById('gamesummary'),'hidden');
	if (board.targetCount==board.targetHit) {
	  document.getElementById('gs_result').innerHTML='Complete: '+board.ammoIndex+' Ball(s)';
	  newCoding=1;
	}
    else
	  document.getElementById('gs_result').innerHTML='Failed. Try Again.';
  
    var best=parseInt(localStorage.getItem('balls'+levNumber));	
	if (isNaN(best)) best=9999;
	
	var currentCoding=parseInt(localStorage.getItem('levcoding'+levNumber));
	if (isNaN(currentCoding)) currentCoding=0;
	
    var medal='none';
	var next='Use '+board.medals[2]+' ball(s) for a Bronze Medal';
	if (board.ammoIndex<=board.medals[0]) {
		medal='Gold';
		next='';
		newCoding=4;
	} else if (board.ammoIndex<=board.medals[1]) {
		medal='Silver';
		next='Use '+board.medals[0]+' ball(s) for a Gold Medal';
		newCoding=3;
	} else if (board.ammoIndex<=board.medals[2]){
		medal='Bronze';
		next='Use '+board.medals[1]+' ball(s) for a Silver Medal';
		newCoding=2;
	}
	if (best<100)
	  next=next+"<p/> Previous Best: "+best+" ball(s)."
	if (board.ammoIndex<best) 
		localStorage.setItem('balls'+levNumber,board.ammoIndex);
	
	if (newCoding>currentCoding)
	   localStorage.setItem('levcoding'+levNumber,newCoding);
	
	var medalE=document.getElementById('gs_medal');
	medalE.innerHTML='Medal: '+medal;
	unsetElementClass(medalE,'Gold');
	unsetElementClass(medalE,'Silver');
	unsetElementClass(medalE,'Bronze');
	unsetElementClass(medalE,'none');
	setElementClass(medalE,medal);
		
	document.getElementById('gs_nexttarget').innerHTML=next;			
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
	 //Start the ammo fire
	 setElementClass(board.ammoTiles[board.ammoIndex],'fired');
	 setElementClass(board.fireButton,'inprogress');
	 	 
	 fireHintEvent("fire");	 
	 
	 //in 5 seconds move up the belt
	 setTimeout(
	   function() {
		  if (board) {
	        setElementClass(board.ammoTiles[board.ammoIndex],'eject');
	        unsetElementClass(board.fireButton,'inprogress');
	 	    board.ammoIndex+=1;
		    if (board.ammoIndex==board.balls.length) board.ended=true;
			fireHintEvent("firecomplete");		 
		  }
          
	   },
	   board.ballLifeTime);	 
   }
   
   
   window.ondragstart = function() { return false; } 

