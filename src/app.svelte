<script>
import { openPtk,usePtk} from 'ptk'
import SwipeVideo from "./swipevideo.svelte";
import Mainmenu from "./mainmenu.svelte";
let ptk;
import {registerServiceWorker} from 'ptk/platform/pwa.js'
import { onMount } from "svelte";
import {activebookid,isIOS} from './store.js'
import TapText from './taptext.svelte'
registerServiceWorker();

isIOS.set(!!navigator.userAgent.match(/iPad|iPhone/));

let loaded=false;
onMount(async ()=>{
    ptk=await openPtk("dc");
    await openPtk("dc_sanskrit");
    loaded=true;
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
const onTapText=(t,_address,ptkname)=>{
    showdict=true;
    tofind=t;
    showmainmenu=false;
    address=_address;
    ptk=usePtk(ptkname);
}
</script>

<div class="app">
{#if loaded}

<!-- <SwipeGallery {items}/> -->
<SwipeVideo src={$activebookid+($isIOS?".mov":".webm")} {ptk} {onTapText} {onMainmenu}/>
{#if showdict || showmainmenu}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<span class="closepopup" on:click={closePopup}>╳</span>
{/if}

{#if showdict}
<TapText {address} {tofind}  {closePopup}/>
{:else if showmainmenu && ptk}
<Mainmenu {ptk} onclose={closePopup}/>
{/if}

{:else}
LOADING
{/if}
</div>
<style>
.app {height:99.5vh;top:0px} /* splitpane divider need this */
.closepopup {z-index:999;font-size:200%;position:absolute;right:0.5em;top:0.5em;color:black;font-weight: bold;}
</style>