
   function random(min,max) {
     return min+(max-min)*Math.random();
   }
   
   function cycleRange(start,end,counter,duration)
   {
     return start+((end-start)*(counter%duration)/duration);
   }
   
   function pingPongRange(start,end,counter,duration)
   {
     var v=(counter%duration);
	 if (v>(duration/2)) 
	    return cycleRange(end,start,counter,duration/2);
	 else 	 
        return cycleRange(start,end,counter,duration/2);
   }
   
   
   function cycleArray(counter,duration,arr)
   {
     var v=cycleRange(0,arr.length,counter,duration);
	 return arr[Math.floor(v)];
   }
   
   /*
       Does a JSON.Parse with a single extra useful functionality:
	   any object (or subobject) with an attribute "_init" will cause a function to be executed
	   after the object is constructed, specifically "_init":"x1234" will cause the execution of x1234_init() 
	   with the this pointer bound to fully loaded object.	      
   */
   function jsonParseWithInitiator(jsonStr)
   {
     return JSON.parse(jsonStr,function(key,value) 
		   {   
			 if (key==='_init') {	    
				return eval(value+'_init');
			 }
			 if (typeof value == 'object') 
			   if (value._init) {
  			     value._init();
				 value._init=null;
			   }
			 
			 return value;
		   });
   }
   