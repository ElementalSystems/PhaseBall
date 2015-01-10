
function null_init()
{
  if (!this.world) this.world="white";
  if (!this.draw) this.draw=function(){};
  if (!this.tick) this.tick=function(){};
  if (!this.checkHit) this.checkHit=function(x1,y1,x2,y2){ return null; };
}

function line_init()
{ 
  this.draw=drawLine;	
  this.checkHit=checkHitLine;
  this.x1*=canvasSize/100.0;
  this.x2*=canvasSize/100.0;
  this.y1*=canvasSize/100.0;
  this.y2*=canvasSize/100.0;
  if (!this.lineWidth) this.lineWidth=5;
  
  
  null_init.bind(this)();   
  
  this.lineCol=["#555","#000","#F00","#00F"];
  if (this.world=="red") this.lineCol=["#C00","#F00","#F55","#700"];
  if (this.world=="blue") this.lineCol=["#00C","#00F","#55F","#007"];
}


function drawLine()
{
  board.ctx.strokeStyle=this.lineCol[0];	  
  board.ctx.lineWidth = this.lineWidth;
  board.ctx.beginPath();
  board.ctx.moveTo(this.x1,this.y1);
  board.ctx.lineTo(this.x2,this.y2);
  board.ctx.stroke();	  
}

function checkHitLine(ax,ay,bx,by)
{
  //check if the given line hits us
  var cx=this.x1;
  var cy=this.y1;
  var dx=this.x2;
  var dy=this.y2;
  
  var ex=bx-ax;
  var ey=by-ay;
  var fx=dx-cx;
  var fy=dy-cy;
  
  var px=-ey;
  var py=ex;
  
  var hnum=(ax-cx)*px+(ay-cy)*py;
  var hden=fx*px+fy*py;
  
  if (hden==0) return null; //lines parrellel
  var h=hnum/hden;
  if ((h<0)||(h>1)) return null; //not a cross on this segement
  
  var qx=-fy;
  var qy=fx;
  
  var gnum=(cx-ax)*qx+(cy-ay)*qy;
  var gden=ex*qx+ey*qy;
  var g=gnum/gden;
  
  if ((g<0)||(g>1)) return null; //not a cross on this segement
  //hey we have a hit!
  var hit={ 
     type: "bounce",
	 targetObject: this	 
  }; 
  
  //calculate point of intersection
  hit.x=ax+ex*g;
  hit.y=ay+ey*g;
  //calculate normal to the line
  hit.normalx=qx;
  hit.normaly=qy;
  
  return hit;
}

function barrier_init()
{
   if (!this.lineWidth) this.lineWidth=1;
   if (!this.lineBlur) this.lineBlur=3;	   
   line_init.bind(this)();
   this.draw=drawBarrier;
}
  
  
function drawBarrier()
{
  board.ctx.strokeStyle=this.lineCol[board.frameNumber%this.lineCol.length];
  board.ctx.lineWidth = this.lineWidth;
  board.ctx.beginPath();
  board.ctx.moveTo(this.x1+random(-this.lineBlur,+this.lineBlur),this.y1+random(-this.lineBlur,+this.lineBlur));
  var ctl=random(0.1,0.9);
  var offsetx=random(-this.lineBlur*5,+this.lineBlur*5);
  var offsety=random(-this.lineBlur*5,+this.lineBlur*5);
  var xcp=this.x1+(this.x2-this.x1)*ctl+offsetx;
  var ycp=this.y1+(this.y2-this.y1)*ctl+offsety;
  
  board.ctx.quadraticCurveTo(xcp,ycp,this.x2+random(-this.lineBlur,+this.lineBlur),this.y2+random(-this.lineBlur,+this.lineBlur));
  board.ctx.stroke();	  
}
