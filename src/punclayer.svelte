<script>
    import { text } from 'svelte/internal';
/* TODO Galaxy Fold ratio smaller than 450/1000, causing punc miss place */
export let frame={};
export let puncs=[];
import {folioChars,folioLines} from './store.js'
import {stylestring} from './unit.js'
const fl=folioLines(),fc=$folioChars;

const unitw=frame.width/fl , unith= frame.height/fc;
import {isPunc} from 'ptk'
const formatPuncText=text=>{
    if (isPunc(text[0])) {
        return text;
    } else if (text[0]=='n') {
        return text.slice(1)
    } return text;
}
const puncStyle=(line,ch,text)=>{
    let fontsize=unith*0.9 ,yinc=unith*0.2,xinc=-unitw*0.1,extrastyle='';
    if (text=='？'||text=='！') {
        fontsize=fontsize/1.5;
        yinc+=unith*0.4;
    } else  if (text=='﹁'||text=='﹃'){
        xinc+=-unitw*0.3;
        yinc+=unith*0.40;
    } else if (text=='﹄' ||text=='﹂'){
        xinc+=-unitw*0.6;
        yinc+=unith*0.4;      
    } else if ( !isPunc(text[0])){ //ck marker or n marker
        if (text[0]=='n') {//經號
            xinc-=unitw*0.5;
            extrastyle='background:var(--n)'
            text=text.slice(1);
            yinc+=unith;
        } else {
            yinc+=unith;
        }
        fontsize=fontsize/1.5;
    }
    const style='left:'+Math.floor(xinc+unitw*(fl-line) - unitw*0.25 )+'px; top:'
    +Math.floor(yinc+unith*(ch-1)- unith*0.2)+'px;font-size:'+fontsize+'px;'+extrastyle;
    return style;
}
</script>

<div class="puncs" style={stylestring(frame)} >
{#each puncs as punc}
<span class="punc" style={puncStyle(punc.line,punc.ch,punc.text)}>{formatPuncText(punc.text)}</span>
{/each}
</div>
