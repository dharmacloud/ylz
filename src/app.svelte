<script>
import { openPtk,usePtk,loadScript} from 'ptk'
// import SwipeVideo from "./swipevideo.svelte";
import SwipeZipImage from "./swipezipimage.svelte";
import {registerServiceWorker} from 'ptk/platform/pwa.js'
import { onDestroy, onMount } from "svelte";
import {activefolioid,isAndroid,playing,idlecount,showpaiji,newbie,idletime,landscape,bookByFolio} from './store.js'
import {setTimestampPtk} from './mediaurls.js'
import TapText from './taptext.svelte'
import Player from './player.svelte'
import Newbie from './newbie.svelte';
import Paiji from './paiji.svelte';
import { get } from 'svelte/store';
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
        if (!shownewbie && !showdict) {
            idlecount.set($idlecount+idleinterval);
        }
    },idleinterval*1000);
});

const loadPlayer=()=>{
    // loadScript('http://vm.gtimg.cn/tencentvideo/txp/js/txplayer.js')
    loadScript('https://www.youtube.com/iframe_api')
}

let showdict=false,shownewbie=$newbie=='on',address='bk#'+bookByFolio($activefolioid),tofind='';
const closePopup=()=>{
    shownewbie=false;
    if (get(landscape)) return;
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

$: loadPlayer();
</script>


<div class="app">
{#if loaded}
{#key $activefolioid}
{#if $showpaiji && !$playing && !showdict && !shownewbie && !landscape}
<Paiji/>
{/if}
<SwipeZipImage src={$activefolioid+".zip"} {ptk} {onTapText} {onMainmenu} bind:address/>
{/key}

{#if (shownewbie||showdict)}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<span class="closepopup" on:click={closePopup}>✖️</span> <!--╳-->
{/if}

{#if showdict || $landscape}
<TapText {address} {tofind}  {closePopup}/>
{/if}

{#if shownewbie}
<Newbie {closePopup}/>
{/if}

<Player/>

{:else}
<span class="loading">如果停在此畫面，表示瀏覽器不直持 Emcascript 2015，無法運行本軟件。</span>
<a class="toctext" href=_new>官方網站</a>
{/if}

</div>

