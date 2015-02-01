function fireHintEvent(type)
{
	if (!board.hints) return;
	var textlist=board.hints[type];
	if (textlist == undefined) return; //no such list exists
	var text=textlist[0];
	if (textlist.length>1)  //remove the first element
        textlist.shift();		
		
	if (text.length==0) {		
	  board.hinttext.innerHTML="";
	  setElementClass(board.hinttext,'hidden');	
	} else {
	  board.hinttext.innerHTML=text;
	  setElementClass(board.hinttext,'hint');	
	  unsetElementClass(board.hinttext,'hidden');	
	}
}

