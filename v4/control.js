   
   function aimDown(e)
   {     
	   var pos=getEventPosFromElement(board.canvas,e);
	   
	   board.aimDragging=true;
       aimGunAt(pos.x,pos.y);
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
	  board.gun.style["-webkit-transform"]="translate(50%,50%) rotate("+board.fireAngle+"rad)";	
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
   
   function spdDown(e)
   {     
	   var pos=getEventPosFromElement(board.spddial,e);
	   board.spdDragging=true;
       spdAt(pos.x,pos.y);
	   return false;
   }
   
   
   function spdUp(e)
   {
     board.spdDragging=false;
	 return false;
   }
   
   function spdDrag(e)
   {
      if  (board.spdDragging)
	    spdDown(e);
      return false;		
   }
   
   function spdAt(x,y)
   {
      x=board.spddial.offsetWidth-x;
	  y=board.spddial.offsetHeight-y;
      var angle=Math.atan2(y,x);
	  if (angle>1.25) angle=1.25;
      if (angle<.25) angle=.25;
	  board.fireSpd=maxFireSpd*angle/1.25;
      board.spdneedle.style.transform="translate(50%,50%) rotate("+angle+"rad)";	
	  board.spdneedle.style["-webkit-transform"]="translate(50%,50%) rotate("+angle+"rad)";	
   }
      
