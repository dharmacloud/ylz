<script>
import { openPtk,addressFromUrl} from 'ptk'
import SwipeZipImage from "./swipezipimage.svelte";
import {registerServiceWorker} from 'ptk/platform/pwa.js'
import {downloadToCache,ptkInCache} from 'ptk/platform/downloader.js'
import { onDestroy } from "svelte";
import {activefolioid,isAndroid,idlecount,showpaiji,leftmode,online,
    folioincache,showsponsor, newbie,idletime,landscape,ptks} from './store.js'
import {CacheName,APPVER} from './constant.js'
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
    import { AppPrefix } from './savestore';
let tofind;
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


const installptk=async name=>{
    bootmessage='try to download '+name+'.ptk'
    const res=await downloadToCache(CacheName,name+'.ptk',msg=>{
        bootmessage=name+'.ptk '+msg;
    })
    const buf=await res.arrayBuffer();
    const ptk=await openPtk(name,new Uint8Array(buf));
    return ptk;
}

const init=async ()=>{
    documentHeight();
    const toload=await ptkInCache(CacheName);   
    for (let i=0;i<ptks.length;i++) {
        if (!~toload.indexOf(ptks[i])) {
            toload.push(ptks[i]);
        }
    }    
    for (let i=0;i<toload.length;i++) {
        const ptk=await installptk(toload[i])
        bootmessage='open ptk '+toload[i];
        //if (ptks[i]=='ylz-prjn') console.log(ptk)
        if (toload[i]=='dc') setTimestampPtk(ptk)
    }
    
    bootmessage='fetching foliolist from cache';
    await fetchFolioList(folioincache);

    bootmessage='load folio address from url';
    let addr=addressFromUrl();
    if (!~addr.indexOf('bk')) {
        addr=localStorage.getItem(AppPrefix+'homeurl')||'';
    }
    
    await loadAddress(addr);
   
    bootmessage='loaded';
    loaded=true;
    
    timer=setInterval(()=>{
        showpaiji.set($idlecount>=idletime);
        if (!shownewbie && !showpopup && $showsponsor=='on') {
            idlecount.set($idlecount+idleinterval);
        }
    },idleinterval*1000);
};


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
setTimeout(init,500);
</script>

<div class="app" bind:this={app}>
{#if loaded}
{#if $showpaiji && !showpopup && !shownewbie && !$landscape && $showsponsor=='on'}
<Paiji/>
{/if}

{#key $activefolioid} 
<SwipeZipImage src={$activefolioid+".zip"} {onTapText} {onMainmenu} />
{/key}

{#if $leftmode!=='folio'}
<Left/>
{/if}
{#if (shownewbie||showpopup) && !$landscape}
<span aria-hidden="true" class="closepopup" on:click={closePopup}>✖️</span> <!--╳-->
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