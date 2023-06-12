<script>
export let frame={};
export let puncs=[];
export let folioChars=17,folioLines=5;
const unitw=frame.width/folioLines , unith= frame.height/folioChars;

const stylestring=(f)=>{
    return `left:${f.left}px;width:${f.width}px;top:${f.top}px;height:${f.height}px`
}
const puncStyle=(line,ch,text)=>{
    let fontsize=unith ,yinc=0,xinc=0;
    if (text=='？'||text=='！') {
        fontsize=fontsize/1.5;
        yinc=unith*0.4;
    }
    if (text=='﹁'||text=='﹃'){
        xinc=-unitw*0.6;
        yinc=unith*0.6;
    } else if (text=='﹄' ||text=='﹂'){
        xinc=-unitw*0.7;
        yinc=unith*0.6;
    }
    const style='left:'+Math.floor(xinc+unitw*(folioLines-line) - unitw*0.2 )+'px; top:'+Math.floor(yinc+unith*(ch-1)- unith*0.2)+'px;font-size:'+fontsize+'px';
    return style;
}
</script>
<div class="puncs" style={stylestring(frame)} >
{#each puncs as punc}
<span class="punc" style={puncStyle(punc.line,punc.ch,punc.text)}>{punc.text}</span>
{/each}
</div>
<style>
    .puncs {z-index:9;position:absolute}
    .punc {z-index:9;position:absolute;color:rgba(255, 0, 0,0.6);font-family: bolder;}
</style>