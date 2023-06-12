<script>
import { openPtk} from 'ptk'
import SwipeVideo from "./swipevideo.svelte";
import Mainmenu from "./mainmenu.svelte";
let ptk;
import {registerServiceWorker} from 'ptk/platform/pwa.js'
import { onMount } from "svelte";
import {activebookid} from './store.js'
import TapText from './taptext.svelte'
registerServiceWorker();

onMount(async ()=>{
    ptk=await openPtk("dc");
    await openPtk("dc_sanskrit");
    console.log(ptk)
});
let showdict=false,address='',tofind='',showmainmenu=false;
const closePopup=()=>{
    showdict=false;
    showmainmenu=false;
}
const onMainmenu=()=>{
    showdict=false;
    showmainmenu=true;
}
const onTapText=(t,_address)=>{
    showdict=true;
    tofind=t;
    showmainmenu=false;
    address=_address;
}
</script>

<div class="app">
<!-- <SwipeGallery {items}/> -->
<SwipeVideo src={$activebookid+".webm"} {ptk} {onTapText} {onMainmenu}/>
{#if showdict || showmainmenu}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<span class="closepopup" on:click={closePopup}>╳</span>
{/if}

{#if showdict}
<TapText {address} {tofind} {ptk} {closePopup}/>
{:else if showmainmenu && ptk}
<Mainmenu {ptk} onclose={closePopup}/>
{/if}
</div>
<style>
.app {height:99.5vh;} /* splitpane divider need this */
.closepopup {z-index:99;font-size:200%;position:absolute;right:0.5em;top:0.5em;color:black;font-weight: bold;}
</style>