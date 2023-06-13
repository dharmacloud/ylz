<script>
import Slider from './3rd/rangeslider.svelte';
import {autoplay} from './store.js';
let value=[$autoplay,0];

const setValue=(e)=>{
    const v=e.detail[0];
    if (v!=$autoplay) autoplay.set(v);
}
</script>

<div class="toctext">
自動翻頁 {#if value[0]}{value[0]} 秒{/if}<Slider bind:value max={10} min={0} on:input={setValue}/>
</div>