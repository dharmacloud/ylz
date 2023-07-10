<script>
import { openPtk,usePtk,loadScript} from 'ptk'
// import SwipeVideo from "./swipevideo.svelte";
import SwipeZipImage from "./swipezipimage.svelte";
import {registerServiceWorker} from 'ptk/platform/pwa.js'
import { onDestroy, onMount } from "svelte";
import {activefolioid,isAndroid,playing,advancemode,idlecount,showpaiji,newbie,idletime} from './store.js'
import {setTimestampPtk} from './mediaurls.js'
import TapText from './taptext.svelte'
import Player from './player.svelte'
import Newbie from './newbie.svelte';
import Paiji from './paiji.svelte';
let ptk;
registerServiceWorker();
const idleinterval=2;
isAndroid.set(!!navigator.userAgent.match(/Android/i));

let loaded=false,timer;
onDestroy(()=>clearInterval(timer))
onMount(async ()=>{
    ptk=await openPtk("dc");
    setTimestampPtk(ptk);
    await openPtk("dc_sanskrit");
    loaded=true;
    timer=setInterval(()=>{
        showpaiji.set($idlecount>=idletime);
        if ($advancemode!=='on' && !shownewbie && !showdict) {
            idlecount.set($idlecount+idleinterval);
        }
    },idleinterval*1000);
});

const loadPlayer=()=>{
    loadScript('http://vm.gtimg.cn/tencentvideo/txp/js/txplayer.js')
    loadScript('https://www.youtube.com/iframe_api')
}

let showdict=false,shownewbie=$newbie=='on',address='',tofind='';
const closePopup=()=>{
    showdict=false;
    shownewbie=false;
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

$: loadPlayer();
</script>
<div class="app">   
{#if loaded}
<Player/>
<!-- <SwipeVideo src={$activefolioid+($isAndroid?".webm":".mp4")} {ptk} {onTapText} {onMainmenu}/> -->
{#key $activefolioid}

{#if $showpaiji && !$playing && !showdict && !shownewbie}
<Paiji/>
{/if}
<SwipeZipImage  src={$activefolioid+".zip"} {ptk} {onTapText} {onMainmenu}/>
{/key}

{#if shownewbie||showdict}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<span class="closepopup" on:click={closePopup}>✖️</span> <!--╳-->
{/if}

{#if showdict}
<TapText {address} {tofind}  {closePopup}/>
{/if}
{#if shownewbie}
<Newbie {closePopup}/>
{/if}

{:else}
<span class="loading">如果停在此畫面，表示手機瀏覽器太舊，不支持 ES2015 。</span>
{/if}
</div>

