<script>
/* TODO Galaxy Fold ratio smaller than 450/1000, causing punc miss place */
export let frame={};
export let puncs=[];
export let folioChars=17,folioLines=5;
import {stylestring} from './unit.js'
const unitw=frame.width/folioLines , unith= frame.height/folioChars;
import {isPunc} from 'ptk'
const puncStyle=(line,ch,text)=>{
    let fontsize=unith*0.9 ,yinc=unith*0.2,xinc=-unitw*0.1;      
    if (text=='？'||text=='！') {
        fontsize=fontsize/1.5;
        yinc+=unith*0.4;
    } else  if (text=='﹁'||text=='﹃'){
        xinc+=-unitw*0.3;
        yinc+=unith*0.40;
    } else if (text=='﹄' ||text=='﹂'){
        xinc+=-unitw*0.6;
        yinc+=unith*0.4;      
    } else if ( !isPunc(text[0])){ //ck marker
        // xinc+=-unitw*0.2;
        yinc+=unith;
        fontsize=fontsize/1.5;
    }
    const style='left:'+Math.floor(xinc+unitw*(folioLines-line) - unitw*0.25 )+'px; top:'
    +Math.floor(yinc+unith*(ch-1)- unith*0.2)+'px;font-size:'+fontsize+'px';
    return style;
}
</script>

<div class="puncs" style={stylestring(frame)} >
{#each puncs as punc}
<span class="punc" style={puncStyle(punc.line,punc.ch,punc.text)}>{punc.text}</span>
{/each}
</div>
