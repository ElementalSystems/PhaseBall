

function target_init()
{ 
  this.draw=drawTarget;	
  this.checkHit=checkHitTarget;
  this.x*=canvasSize/100.0;
  this.y*=canvasSize/100.0;
  this.targetr2=(targetSize+ballSize)*(targetSize+ballSize);
  
  null_init.bind(this)();   
  
  this.lineCol=["#CCC","#FFF","#888"];
  if (this.world=="red") this.lineCol=["#C30","#F30","#FF8","#FF0"];
  if (this.world=="blue") this.lineCol=["#00C","#00F","#5FF","#0FF"];
  this.targetCount=1;
}


function drawTarget()
{
  
  board.ctx.strokeStyle=cycleArray(board.gameTime,1000,this.lineCol);
  board.ctx.lineWidth = 1;
  board.ctx.beginPath();
  var st=cycleRange(0,Math.PI*2,board.gameTime,2000);
  for (var rad=2;rad<targetSize;rad+=3) {
    var end=st+Math.PI/2;
	if (st>Math.PI*2) st-=Math.PI*2;
	if (end>Math.PI*2) end-=Math.PI*2;	
    board.ctx.arc(this.x,this.y,rad,st,end,true);
	st=end;
  }
  board.ctx.globalAlpha=.6;
  board.ctx.stroke();	  
  board.ctx.globalAlpha=1;
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