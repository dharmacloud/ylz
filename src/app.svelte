<script>
import { openPtk,usePtk,loadScript} from 'ptk'
// import SwipeVideo from "./swipevideo.svelte";
import SwipeZipImage from "./swipezipimage.svelte";
import {registerServiceWorker} from 'ptk/platform/pwa.js'
import { onMount } from "svelte";
import {activebookid,isAndroid,player,videohost} from './store.js'
import TapText from './taptext.svelte'
import Player from './player.svelte'

let ptk;
registerServiceWorker();

isAndroid.set(!!navigator.userAgent.match(/Android/i));

let loaded=false;
onMount(async ()=>{
    ptk=await openPtk("dc");
    await openPtk("dc_sanskrit");
    loaded=true;
    if ($videohost=='youtube') {
        await loadScript('https://www.youtube.com/iframe_api')
    } else if ($videohost=='tencent') {
        await loadScript('http://vm.gtimg.cn/tencentvideo/txp/js/txplayer.js')
    }
});
let showdict=false,address='',tofind='';
const closePopup=()=>{
    showdict=false;
}
const onMainmenu=()=>{
    showdict=false;
}
const onTapText=(t,_address,ptkname)=>{
    showdict=true;
    tofind=t;
    address=_address;
    ptk=usePtk(ptkname);
}
</script>


<div class="app" >
{#if loaded}
<Player/>

<!-- <SwipeVideo src={$activebookid+($isAndroid?".webm":".mp4")} {ptk} {onTapText} {onMainmenu}/> -->
{#key $activebookid}
<SwipeZipImage  src={$activebookid+".zip"} {ptk} {onTapText} {onMainmenu}/>
{/key}

{#if showdict}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<span class="closepopup" on:click={closePopup}>✖️</span> <!--╳-->
{/if}

{#if showdict}
<TapText {address} {tofind}  {closePopup}/>
{/if}

{:else}
<span class="loading">如果停在此畫面，表示手機瀏覽器太舊，不支持 ES2015 。</span>
{/if}
</div>

