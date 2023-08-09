<script>
import { openPtk,usePtk,loadScript} from 'ptk'
// import SwipeVideo from "./swipevideo.svelte";
import SwipeZipImage from "./swipezipimage.svelte";
import {registerServiceWorker} from 'ptk/platform/pwa.js'
import { onDestroy, onMount } from "svelte";
import {activefolioid,isAndroid,playing,idlecount,showpaiji,leftmode,online,folioincache,
    newbie,idletime,landscape,showsponsor} from './store.js'
import {setTimestampPtk} from './mediaurls.js'
import {fetchFolioList} from './folio.js'
import TapText from './taptext.svelte'
import Player from './player.svelte'
import Newbie from './newbie.svelte';
import Paiji from './paiji.svelte';
import { get } from 'svelte/store';
import Left from './left.svelte'
let ptk,tofind;
registerServiceWorker();
const idleinterval=2;
isAndroid.set(!!navigator.userAgent.match(/Android/i));

const handleConnection=()=>{
    online.set(navigator.onLine);
}

window.addEventListener('online', handleConnection);
window.addEventListener('offline', handleConnection);

let loaded=false,timer;
onDestroy(()=>clearInterval(timer))
onMount(async ()=>{
    await fetchFolioList(folioincache);
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
    if (ls) shownewbie=false;
    idlecount.set(0)
}
$: orientation($landscape)

// $: console.log(sidepaiji,idletime,$idlecount,$showpaiji,$playing,showdict)
</script>


<div class="app">
{#if loaded}

{#if $showpaiji && !showdict && !shownewbie && !$landscape && $showsponsor=='on'}
<Paiji/>
{/if}

{#key $activefolioid} 
<SwipeZipImage src={$activefolioid+".zip"} {ptk} {onTapText} {onMainmenu} />
{/key}

{#if $leftmode!=='folio'}
<Left {ptk}/>
{/if}

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
<span class="loading">如果停在此畫面，表示瀏覽器不直持 ECMAscript 2015，無法運行本軟件。
請改用 Chrome 瀏覽器訪問本頁面。iOS 須 13 版以上，並使用內建的 Safari 。
</span>

<a class="toctext" href="https://nissaya.cn/" target="_new">網址</a>
{/if}

</div>

