<script>
import {sideWidth,paijitexts,folioHolderWidth,landscape, playing,isSidePaiji} from './store.js'
import {onDestroy} from 'svelte'
let now=0;
export let forceshow=false;
let text=paijitexts[0];
let timer=setInterval(()=>{
    text=paijitexts[ ++now%paijitexts.length ];
},5000)
onDestroy(()=>{
    clearInterval(timer)
})

</script>

{#if isSidePaiji() && !forceshow}
<div class="sidepaiji" style={sideWidth()} >
    <div class="sidesponsor">{text}</div>
    <div class="sidesponsortext">願以此功德、普及於一切，</div>
    <div class="sidesponsortext2">我等與眾生、皆共成佛道。</div>
</div>
{:else if !$playing}
<div class="paiji" style={'width:'+(forceshow?folioHolderWidth():'')}>
<img alt="frame" src="frames/red.jpg"/>
<div class="sponsor" style={"padding-left:"+(forceshow?folioHolderWidth($landscape,0.45):'45vw')}>{text}</div>

<div class="paijitextcontainer">
<div class="paijitext">
<br/>　諸供養中　法供養最
<br/>願以此功德　普及於一切
<br/>我等與眾生　皆共成佛道
</div>
</div>

</div>
{/if}
<style>
    img {width:100%;height:100%;pointer-events: none;position:absolute}
</style>

