<script>
import { openPtk,usePtk} from 'ptk'
// import SwipeVideo from "./swipevideo.svelte";
import SwipeZipImage from "./swipezipimage.svelte";
import Mainmenu from "./mainmenu.svelte";
import {registerServiceWorker} from 'ptk/platform/pwa.js'
import { onMount } from "svelte";
import {activebookid,isAndroid} from './store.js'
import TapText from './taptext.svelte'
let ptk;
registerServiceWorker();

isAndroid.set(!!navigator.userAgent.match(/Android/i));

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


<div class="app" >
{#if loaded}

<!-- <SwipeVideo src={$activebookid+($isAndroid?".webm":".mp4")} {ptk} {onTapText} {onMainmenu}/> -->
{#key $activebookid}
<SwipeZipImage src={$activebookid+".zip"} {ptk} {onTapText} {onMainmenu}/>
{/key}

{#if showdict || showmainmenu}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<span class="closepopup" on:click={closePopup}>╳</span>
{/if}

{#if showdict}
<TapText {address} {tofind}  {closePopup}/>
{:else if showmainmenu && ptk}
<Mainmenu {ptk} {closePopup}/>
{/if}

{:else}
....SYSTEM LOADING... need es2015
{/if}
</div>
<style>
.app {height:99.5vh;top:0px} /* splitpane divider need this */
.closepopup {z-index:999;font-size:200%;position:absolute;right:0.5em;top:0.5em;color:black;font-weight: bold;}
</style>