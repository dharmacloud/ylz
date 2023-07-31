<script>
import DictPopup from "./dictpopup.svelte"
import Foliolist from "./foliolist.svelte"
import Audio from "./audio.svelte"
import About from "./about.svelte"
import Textual from './textual.svelte'
import { get } from 'svelte/store';
//import Favorite from "./favorite.svelte"
import Toc from "./toc.svelte"
import {activePtk,tapAddress, landscape,sideWidth,searchable} from './store.js'
import { usePtk} from "ptk";
import {CURSORMARK} from './nav.js'
export let tofind='';
export let address='';
export let closePopup;
let thetab=get(landscape)?"textual":"toc";
let ptk ,entries=[];

const onDict=(t)=>{
    const tap_at=t.indexOf(CURSORMARK);
    entries=ptk.columns.entries.keys.findMatches( t.replace(CURSORMARK,'')).map(it=>[Math.abs(it[0]-tap_at-1),it[1],it[2]]);
    entries.sort((a,b)=> a[0]-b[0]);// 越接近點擊處的優先
    showdict=true;
}
const setSearchable=t=>{
    const tap_at=t.indexOf(CURSORMARK);
    searchable.set(t.slice(tap_at+1));
}
$: ls=get(landscape);
$: ptk=usePtk($activePtk);
$: setSearchable(tofind);
$: thetab=='dict' && onDict(tofind);
</script>
{#key $landscape}
<div class="popup" style={ls?sideWidth(ls):''}>
    <div class="tabs">    
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <span class='clickable' class:selected={thetab=="about"} on:click={()=>thetab="about"}>⚙️{#if ls}設定{/if}</span>

        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <span class='clickable' class:selected={thetab=="list"} on:click={()=>thetab="list"}>📚{#if ls}經卷{/if}</span>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <span class='clickable' class:selected={thetab=="toc"} on:click={()=>thetab="toc"}>🧭{#if ls}目錄{/if}</span>
        
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <span class='clickable' class:selected={thetab=="textual"} on:click={()=>thetab="textual"}>📜{#if ls}文字{/if}</span>    
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        {#if !ls}
        <span class='clickable' class:selected={thetab=="audio"} on:click={()=>thetab="audio"}>🎵</span>
        {/if}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <span class='clickable' class:selected={thetab=="dict"} on:click={()=>thetab="dict"}>🔠{#if ls}字典{/if}</span>
        {#if $landscape}<span style="font-size:65%">{$tapAddress}</span>{/if}
    </div>
      <div class="tab-content" class:visible={thetab=='list'}><Foliolist {ptk} {closePopup}  bind:thetab /></div>
      <div class="tab-content" class:visible={thetab=='toc'}><Toc {closePopup} {ptk} /></div>
      <!-- <div class="tab-content" class:visible={thetab=='favorite'}><Favorite {address} {closePopup} {ptk} /></div> -->
      <div class="tab-content" class:visible={thetab=='textual'}><Textual {closePopup} {ptk}/></div>
      {#if entries.length}
      <div class="tab-content" class:visible={thetab=='dict'}><DictPopup {entries} {ptk} {address}/></div>
      {/if}
      <div class="tab-content" class:visible={thetab=='audio'}><Audio {ptk}/></div>
      <div class="tab-content" class:visible={thetab=='about'}><About/></div>

 </div>
 {/key}
<style>

</style>