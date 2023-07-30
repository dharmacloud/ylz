<script>
import {sideWidth,paijitexts} from './store.js'
import {onDestroy} from 'svelte'
let now=0;
let text=paijitexts[0];
let timer=setInterval(()=>{
    text=paijitexts[ ++now%paijitexts.length ];
},5000)
onDestroy(()=>{
    clearInterval(timer)
})
const m=sideWidth().match(/width:(\d+)/);
const sidepaiji=m&&m[1]&&parseInt(m[1])>20;
</script>

{#if sidepaiji}
<div class="sidepaiji" style={sideWidth()} >
    <div class="sidesponsor">{text}</div>  
</div>
{:else}
<div class="paiji">
<img alt="frame" src="frames/red.jpg"/>
<div class="sponsor">{text}</div>

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

