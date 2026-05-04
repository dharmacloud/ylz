<script>
import {activefolioid,showgallery,showinggallery} from "./store.js"
import {_} from './textout.js'
import { fade } from 'svelte/transition';
const srcs={
    'pphs':"newbie.png",
    'pph':"pphs_ulucitta.jpg",
    'ksitigarbha1':'ksitigarbha1.jpg',
    'ksitigarbha2':'ksitigarbha2.jpg',
}

const hide=()=>{
    showinggallery.set(false)
}
</script>

{#if srcs[$activefolioid] && $showinggallery}
<img aria-hidden="true" on:click={hide} in:fade out:fade={{duration:2000}} src={srcs[$activefolioid]} alt=''/>
<span>{_("點擊隱藏此圖，可設置取消「顯示經變圖」")}</span>
{/if}

<style>
    span {position:absolute;bottom:0px;z-index:199;color:white;background-color: black;}
    img {position:absolute;z-index:99;height: 100%}
</style>