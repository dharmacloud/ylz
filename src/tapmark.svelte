<script>
export let mark=0,frame,pb=0;
import {MAXFOLIOCHAR,MAXFOLIOLINE} from 'ptk'
export let folioChars=17,folioLines=5;
const unitw=frame.width/folioLines , unith= frame.height/folioChars;

const styleString=()=>{
    if (!mark)return;
    const charperpage=(MAXFOLIOCHAR*MAXFOLIOLINE);
    const _pb=Math.floor( mark/ charperpage);
    if (_pb!==pb) return '';
    const line=Math.floor( (mark-pb*charperpage) / MAXFOLIOCHAR)
    const ch= 1+(mark-pb*charperpage-line*MAXFOLIOCHAR);
    

    return 'left:'+Math.floor(frame.left+unitw*(folioLines-line-1) )+'px; top:'+
+Math.floor(frame.top+unith*(ch-1))+'px;width:'+unitw+'px;height:'+unith
+'px;background:var(--pinmark);border-radius:5px';
}


</script>
<span class="punc" style={styleString()}> </span>