<script>
export let mark=[],frame,pb='';

export let folioChars=17,folioLines=5;
const unitw=frame.width/folioLines , unith= frame.height/folioChars;
//assuming frame.left ==0
const styleString=()=>{
    const [pbmark,line,ch]=mark;
    if (pb!=pbmark) return '';
    return 'left:'+Math.floor(unitw*(folioLines-line-1) )+'px; top:'+
+Math.floor(frame.top+unith*(ch))+'px;width:'+unitw+'px;height:'+unith
+'px;background:var(--pinmark);border-radius:5px;pointer-events:none';
}
</script>
<span class="punc" style={styleString()}> </span>