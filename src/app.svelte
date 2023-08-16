<script>
import { openPtk} from 'ptk'
import SwipeZipImage from "./swipezipimage.svelte";
import {registerServiceWorker} from 'ptk/platform/pwa.js'
import { onDestroy, onMount } from "svelte";
import {activefolioid,isAndroid,idlecount,showpaiji,leftmode,online,folioincache,showsponsor,sharing,
    newbie,idletime,landscape} from './store.js'
import {setTimestampPtk} from './mediaurls.js'
import {fetchFolioList} from './folio.js'
import TapText from './taptext.svelte'
import Player from './player.svelte'
import Newbie from './newbie.svelte';
import Paiji from './paiji.svelte';
import Notification from './notification.svelte';
import { get } from 'svelte/store';
import Left from './left.svelte'
import { downloadToCache } from './comps/downloader.js';
import { addressFromUrl } from './urlhash.js';
import {loadAddress} from './nav.js'
let ptk,tofind;
registerServiceWorker();
const idleinterval=2;
isAndroid.set(!!navigator.userAgent.match(/Android/i));

const handleConnection=()=>{
    online.set(navigator.onLine);
}

window.addEventListener('online', handleConnection);
window.addEventListener('offline', handleConnection);

let loaded=false,timer,downloadmessage='';
onDestroy(()=>clearInterval(timer))
onMount(async ()=>{
    const resdc=await downloadToCache('dc.ptk',msg=>{
        downloadmessage='Downloading dc.ptk '+msg;
    })    
    const resdcsanskrit=await downloadToCache('dc_sanskrit.ptk');
    downloadmessage='';
    await fetchFolioList(folioincache);
    ptk=await openPtk("dc",new Uint8Array(await resdc.arrayBuffer()));
    setTimestampPtk(ptk);
    await openPtk("dc_sanskrit",new Uint8Array(await resdcsanskrit.arrayBuffer()));
    await loadAddress(ptk,addressFromUrl());

    loaded=true;
    timer=setInterval(()=>{
        showpaiji.set($idlecount>=idletime);
        if (!shownewbie && !showpopup && $showsponsor=='on') {
            idlecount.set($idlecount+idleinterval);
        }
    },idleinterval*1000);
});


let showpopup=false,shownewbie=$newbie=='on';
const closePopup=()=>{
    shownewbie=false;
    if (get(landscape)) return;
    showpopup=false;
}
const onMainmenu=()=>{
    showpopup=false;
}
const onTapText=(t)=>{
    showpopup=true;
    if (typeof t=='string') tofind=t;
}
const orientation=(ls)=>{
    showpopup=false;
    if (ls) shownewbie=false;
    idlecount.set(0)
}
$: orientation($landscape)

// $: console.log(sidepaiji,idletime,$idlecount,$showpaiji,$playing,showpopup)
</script>


<div class="app">
{#if loaded}

{#if $showpaiji && !showpopup && !shownewbie && !$landscape && $showsponsor=='on'}
<Paiji/>
{/if}

{#key $activefolioid} 
<SwipeZipImage src={$activefolioid+".zip"} {ptk} {onTapText} {onMainmenu} />
{/key}

{#if $leftmode!=='folio'}
<Left {ptk}/>
{/if}
{#if (shownewbie||showpopup) && !$landscape}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<span class="closepopup" on:click={closePopup}>✖️</span> <!--╳-->
{/if}
{#if showpopup || $landscape}
<TapText {tofind} {closePopup}/>
{/if}
{#if shownewbie}
<Newbie {closePopup}/>
{/if}
<Player/>
<Notification/>
{:else}
<span class="loading">
如果停在此畫面沒有進度，表示瀏覽器不直持 ECMAscript 2015，無法運行本軟件。
請改用 Chrome 瀏覽器訪問本頁面。iOS 須 13 版以上，並使用內建的 Safari 。
<br/>{downloadmessage}
</span>

<a class="toctext" href="/" target="_new">官網</a>
{/if}

</div>

