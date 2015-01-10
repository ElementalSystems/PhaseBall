

function target_init()
{ 
  this.draw=drawTarget;	
  this.checkHit=checkHitTarget;
  this.x*=canvasSize/100.0;
  this.y*=canvasSize/100.0;
  this.targetr2=(canvasSize/100.0*canvasSize/100.0);
  
  null_init.bind(this)();   
  
  
  this.lineCol=["#000","#555","#900","#009"];  
  if (this.world=="red") this.lineCol=["#C00","#F00","#F55","#700"];
  if (this.world=="blue") this.lineCol=["#00C","#00F","#55F","#007"];
}


function drawTarget()
{
  
  board.ctx.strokeStyle=this.lineCol[board.frameNumber%this.lineCol.length];
  board.ctx.lineWidth = 1;
  board.ctx.beginPath();
  var st=(board.gameTime%2000)*Math.PI*2/2000;
  for (var rad=2;rad<20;rad+=3) {
    var end=st+Math.PI/2;
	if (st>Math.PI*2) st-=Math.PI*2;
	if (end>Math.PI*2) end-=Math.PI*2;	
    board.ctx.arc(this.x,this.y,rad,st,end,true);
	st=end;
  }
  board.ctx.stroke();	  
}

function checkHitTarget(ax,ay,bx,by)
{
  //we only care if the leading point bx,by in within our radius
  var dist2=(bx-this.x)*(bx-this.x)+(by-this.y)*(by-this.y);
  if (dist2<this.targetr2)  //you difitely hit me then
    return { 
       type: 'targethit',
	   targetObject: this,
	   x: bx,
	   y: by
    };   
  
  return null;  
}