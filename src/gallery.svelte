<script>
import {activefolioid} from "./store.js"
import { fade } from 'svelte/transition';
let showit=true;
const srcs={
    'pphs':"pphs_ulucitta.jpg",
    'ksitigarbha1':'ksitigarbha1.jpg',
    'ksitigarbha2':'ksitigarbha2.jpg',
}

setTimeout(()=>{
    showit=false;
},2000);
</script>
<div>
{#if srcs[$activefolioid] && showit}
<img in:fade out:fade={{duration:3000}} src={srcs[$activefolioid]}/>
{/if}
</div>

<style>
    img {z-index:999;height: 100%;position:absolute}
</style>