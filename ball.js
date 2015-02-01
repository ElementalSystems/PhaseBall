

function ball_init()
{ 
  this.draw=drawBall;	
  this.tick=tickBall;	
  this.x*=canvasSize/100.0;
  this.y*=canvasSize/100.0;
  this.vx*=canvasSize/100.0;
  this.vy*=canvasSize/100.0;
  
  
  null_init.bind(this)();     
  this.phase=-1;
  this.nextPhaseTime=0;
  
}

function nextPhaseBall()
{
  this.phase+=1;
  if (this.phase>=this.phasePlan.length) { //we're done
    board.killList.push(this);
	return;
  }
  this.nextPhaseTime=board.gameTime+board.ballLifeTime/this.phasePlan.length;
  switch (this.phasePlan.charAt(this.phase)) {
    case 'r': 
	   this.world="red";
	   this.lineCol=["#C30","#F30","#FF8","#FF0"];
	   break;
    case 'b': 
	   this.world="blue";
	   this.lineCol=["#00C","#00F","#5FF","#0FF"];
	   break;
    default:
	   this.world="white";
	   this.lineCol=["#CCC","#FFF","#888"];;
	   break;
  }
  
}

function tickBall()
{
   if (board.gameTime>this.nextPhaseTime)
      nextPhaseBall.bind(this)();
   
   var nx=this.x+this.vx*board.frameTime/1000.0;
   var ny=this.y+this.vy*board.frameTime/1000.0;   
   var hits=checkHits(this.x,this.y,nx,ny,this.world);
   var updatePos=true;
   if (hits) {
     for (var i=0;i<hits.length;i+=1) {
	   if (hits[i].type=='bounce') {
	     bounceBall.bind(this)(hits[i]);		 
		 updatePos=false;
	   } else if (hits[i].type=='targethit') {
	     updatePos=true;
		 board.killList.push(hits[i].targetObject);
		 fireHintEvent('targethit');
	   }	   
	 };
   } 
   if (updatePos) {
     this.x=nx;
	 this.y=ny;
   }   
}

function bounceBall(hit)
{
   //consider the bounce
   var ufact=(this.vx*hit.normalx+this.vy*hit.normaly)/(hit.normalx*hit.normalx+hit.normaly*hit.normaly);
   var ux=ufact*hit.normalx;
   var uy=ufact*hit.normaly;
   var wx=this.vx-ux;
   var wy=this.vy-uy;
   
   //reset the velocity for aftert he bounce
   this.vx=wx-ux;
   this.vy=wy-uy;   
}

function drawBall()
{
  
  //board.ctx.strokeStyle=cycleArray(board.gameTime,250,this.lineCol);
  board.ctx.strokeStyle=this.lineCol[0];
  board.ctx.lineWidth = 6;
  board.ctx.globalAlpha=.5;
  board.ctx.beginPath();
  board.ctx.arc(this.x,this.y,ballSize,0,Math.PI*2,true);
  board.ctx.stroke();	
  
  var rad=pingPongRange(1,ballSize-3,board.gameTime,300);
  board.ctx.strokeStyle=cycleArray(board.gameTime,250,this.lineCol);
  board.ctx.lineWidth = 1;
  board.ctx.globalAlpha=1;
  board.ctx.beginPath();
  board.ctx.arc(this.x,this.y,rad,0,Math.PI*2,true);
  board.ctx.stroke();	
  
}
