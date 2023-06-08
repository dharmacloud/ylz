<script>
import { openPtk,guessEntry } from "ptk";
import SwipeVideo from "./swipevideo.svelte";
import DictPopup from "./dictpopup.svelte"
let ptk;
import {registerServiceWorker} from 'ptk/platform/pwa.js'
import { onMount } from "svelte";
registerServiceWorker();

onMount(async ()=>{
    ptk=await openPtk("dc");
});
let def='',showdict=false;
const closeDict=()=>{
    showdict=false;
}

const onDict=async (t)=>{
    const entry=guessEntry( t,ptk.defines.e.fields.id.values);
    const defs=await ptk.fetchAddress('e#'+entry);
    if (defs.length) {
        def=defs.join('\n')
        showdict=true;
    }

}
</script>

<div class="app">
<!-- <SwipeGallery {items}/> -->
<SwipeVideo src="vcpp.webm" {ptk} {onDict}/>
{#if showdict}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<span class="closepopup" on:click={closeDict}>╳</span>
<DictPopup {def}/>
{/if}
</div>
<style>
.app {height:97vh} /* splitpane divider need this */
.closepopup {z-index:99;font-size:150%;position:absolute;right:0px;top:0px;color:black;font-weight: bold;}
</style>