<script>
import Slider from './3rd/rangeslider.svelte';
import {autoplay,activefolio,maxfolio} from './store.js';
let value=[$autoplay,0];
let folio=[$activefolio];
const setValue=(e)=>{
    const v=e.detail[0];
    if (v!=$autoplay) autoplay.set(v);
}
const setFolio=(e)=>{
    const v=e.detail[0];
    activefolio.set(v);
}
</script>

<div class="toctext">
跳到第{ (folio[0]||0)+1}頁 <Slider bind:value={folio} on:input={setFolio} max={$maxfolio} min={0} />
自動翻頁 {#if value[0]}{value[0]} 秒{/if}<Slider bind:value max={10} min={0} on:input={setValue}/>
</div>