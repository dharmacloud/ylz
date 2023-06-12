<script>
export let frame={};
export let puncs=[];
export let folioChars=17,folioLines=5;
const unitw=frame.width/folioLines , unith= frame.height/folioChars;
import {isPunc} from 'ptk'
const stylestring=(f)=>{
    return `left:${f.left}px;width:${f.width}px;top:${f.top}px;height:${f.height}px`
}
const puncStyle=(line,ch,text)=>{
    let fontsize=unith*0.9 ,yinc=unith*0.2,xinc=0;
    
    if (text=='？'||text=='！') {
        fontsize=fontsize/1.5;
        yinc+=unith*0.4;
    } else  if (text=='﹁'||text=='﹃'){
        xinc+=-unitw*0.4;
        yinc+=unith*0.6;
    } else if (text=='﹄' ||text=='﹂'){
        xinc+=-unitw*0.7;
        yinc+=unith*0.6;
    } else if ( !isPunc(text[0])){ //ck marker
        // xinc+=-unitw*0.2;
        yinc+=unith;
        fontsize=fontsize/1.5;
    }
    const style='left:'+Math.floor(xinc+unitw*(folioLines-line) - unitw*0.25 )+'px; top:'
    +Math.floor(frame.top+yinc+unith*(ch-1)- unith*0.2)+'px;font-size:'+fontsize+'px';
    return style;
}
// const getVLine=(i)=>{
//     return 'left:'+unitw*i+'px;top:0px;width:2px;height:'+frame.height+'px';
// }
</script>

<div class="puncs" style={stylestring(frame)} >
{#each puncs as punc}
<span class="punc" style={puncStyle(punc.line,punc.ch,punc.text)}>{punc.text}</span>
{/each}

<!-- <div class="vline" style={getVLine(1)}></div>
<div class="vline" style={getVLine(2)}></div>
<div class="vline" style={getVLine(3)}></div>
<div class="vline" style={getVLine(4)}></div> -->
</div>
<style>
    .puncs {z-index:9;position:absolute;user-select: none;overflow:hidden}
    .punc {z-index:9;position:absolute;color:rgba(255, 0, 0,0.6);font-family: bolder;}
    /* .vline{position:absolute;z-index:9;background:rgba(128,128,128,0.3);} */
</style>