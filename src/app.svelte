<script>
import { openPtk,addressFromUrl, usePtk} from 'ptk'
import SwipeZipImage from "./swipezipimage.svelte";
import {registerServiceWorker} from 'ptk/platform/pwa.js'
import {downloadToCache} from 'ptk/platform/downloader.js'
import { onDestroy, onMount } from "svelte";
import {activefolioid,isAndroid,idlecount,showpaiji,leftmode,online,folioincache,showsponsor,sharing,
    newbie,idletime,landscape,APPVER,ptks} from './store.js'
import {CacheName} from './constant.js'
import {documentHeight} from './fullscreen.js'
import {setTimestampPtk} from './mediaurls.js'
import {fetchFolioList} from './folio.js'
import TapText from './taptext.svelte'
import Player from './player.svelte'
import Newbie from './newbie.svelte';
import Paiji from './paiji.svelte';
import Notification from './notification.svelte';
import { get } from 'svelte/store';
import Left from './left.svelte'


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
let app;
let loaded=false,timer,bootmessage='啟動中';
onDestroy(()=>clearInterval(timer))


const openptk=async name=>{
    bootmessage='try to download '+name+'.ptk'
    const res=await downloadToCache(CacheName,name+'.ptk',msg=>{
        bootmessage=name+'.ptk '+msg;
    })
    const buf=await res.arrayBuffer();
    const ptk=await openPtk(name,new Uint8Array(buf));
    return ptk;
}

onMount(async ()=>{
    documentHeight();
    for (let i=0;i<ptks.length;i++) {
        const ptk=await openptk(ptks[i])
        bootmessage='open ptk '+ptks[i];
        if (ptks[i]=='ylz') console.log(ptk)
    }

    bootmessage='fetching foliolist from cache';
    await fetchFolioList(folioincache);

    ptk=usePtk('ylz');
    bootmessage='load folio address from url';
    await loadAddress(ptk,addressFromUrl());

    bootmessage='loaded';
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

<div class="app" bind:this={app}>
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
<div class="bodytext">
永樂藏 {APPVER} <a href="https://nissaya.cn/" target="_new">官網</a>
<br/>{bootmessage}
</div>
{/if}
</div>

