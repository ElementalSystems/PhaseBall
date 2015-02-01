
function null_init()
{
  if (!this.world) this.world="white";
  if (!this.draw) this.draw=function(){};
  if (!this.tick) this.tick=function(){};
  if (!this.checkHit) this.checkHit=function(x1,y1,x2,y2){ return null; };
  
}



function createLine(nx1,ny1,nx2,ny2,nworld)
{
  var n={
    x1: nx1,
	y1: ny1,
	x2: nx2,
	y2: ny2,
	world: nworld,
	_init: line_init
  };
  n._init();
  return n;
}

function line_init()
{ 
  this.draw=drawLine;	
  this.checkHit=checkHitLine;
  this.x1*=canvasSize/100.0;
  this.x2*=canvasSize/100.0;
  this.y1*=canvasSize/100.0;
  this.y2*=canvasSize/100.0;
  this.active=true;
  if (!this.lineWidth) this.lineWidth=5;
  
  
  null_init.bind(this)();   
  
  this.lineCol=["#CCC","#FFF","#888"];
  if (this.world=="red") this.lineCol=["#C30","#F30","#FF8","#FF0"];
  if (this.world=="blue") this.lineCol=["#00C","#00F","#5FF","#0FF"];
}


function drawLine()
{
  if (!this.active) return;  
  board.ctx.strokeStyle=this.lineCol[0];	  
  board.ctx.lineWidth = this.lineWidth;
  board.ctx.beginPath();
  board.ctx.moveTo(this.x1,this.y1);
  board.ctx.lineTo(this.x2,this.y2);
  board.ctx.stroke();	  
}

function checkHitLine(ax,ay,bx,by)
{
  if (!this.active) return null;
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
   if (!this.lineWidth) this.lineWidth=1.5;
   if (!this.lineBlur) this.lineBlur=2;	   
   line_init.bind(this)();
   this.draw=drawBarrier;
   this.tick=tickBarrier;
   if (this.flashpattern) 
     this.nextPattern=0;   
   
}
  
  
function drawBarrier()
{
  if (!this.active) return;
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

function tickBarrier()
{
	if ((this.flashpattern)&&(board.worldTime>this.nextPattern)) {
		if (this.nextPattern==0) this.nextPattern=board.worldTime+this.flashpattern.offset+this.flashpattern.on;
		else {
			if (this.active) {
				this.active=false;
				this.nextPattern=board.worldTime+this.flashpattern.off;
			} else {
				this.active=true;
				this.nextPattern=board.worldTime+this.flashpattern.on;
			}  						
		}		
	}	
}