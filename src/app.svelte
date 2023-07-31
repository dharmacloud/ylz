<script>
import { openPtk,usePtk,loadScript} from 'ptk'
// import SwipeVideo from "./swipevideo.svelte";
import SwipeZipImage from "./swipezipimage.svelte";
import {registerServiceWorker} from 'ptk/platform/pwa.js'
import { onDestroy, onMount } from "svelte";
import {activefolioid,isAndroid,playing,idlecount,showpaiji,folioHolderWidth,
    newbie,idletime,landscape,showsponsor, loadingbook} from './store.js'
import {setTimestampPtk} from './mediaurls.js'
import TapText from './taptext.svelte'
import Player from './player.svelte'
import Newbie from './newbie.svelte';
import Paiji from './paiji.svelte';
import { get } from 'svelte/store';
let ptk,tofind;
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
        if (!shownewbie && !showdict && $showsponsor=='on') {
            idlecount.set($idlecount+idleinterval);
        }
    },idleinterval*1000);
});

const loadPlayer=()=>{
    // loadScript('http://vm.gtimg.cn/tencentvideo/txp/js/txplayer.js')
    loadScript('https://www.youtube.com/iframe_api')
}

let showdict=false,shownewbie=$newbie=='on';
const closePopup=()=>{
    shownewbie=false;
    if (get(landscape)) return;
    showdict=false;
}
const onMainmenu=()=>{
    showdict=false;
}
const onTapText=(t)=>{
    showdict=true;
    if (typeof t=='string') tofind=t;
}
const orientation=(ls)=>{
    showdict=false;
    shownewbie=false;
}
$: orientation($landscape)
$: loadPlayer();

// $: console.log(sidepaiji,idletime,$idlecount,$showpaiji,$playing,showdict)
</script>


<div class="app">
{#if loaded}

{#if $showpaiji && !$playing && !showdict && !shownewbie && !$landscape && $showsponsor=='on'}
<Paiji/>
{/if}

{#key $activefolioid} 
<SwipeZipImage src={$activefolioid+".zip"} {ptk} {onTapText} {onMainmenu} />
{/key}

{#if (shownewbie||showdict) && !$landscape}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<span class="closepopup" on:click={closePopup}>✖️</span> <!--╳-->
{/if}

{#if showdict || $landscape}
<TapText {tofind} {closePopup}/>
{/if}

{#if shownewbie}
<Newbie {closePopup}/>
{/if}

<Player/>

{:else}
<span class="loading">如果停在此畫面，表示瀏覽器不直持 ECMAscript 2015，無法運行本軟件。</span>
<a class="toctext" href=_new>官方網站</a>
{/if}

</div>

