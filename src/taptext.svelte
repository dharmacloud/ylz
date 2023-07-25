<script>
import DictPopup from "./dictpopup.svelte"
import Foliolist from "./foliolist.svelte"
import Audio from "./audio.svelte"
import About from "./about.svelte"
import Textual from './textual.svelte'
import { get } from 'svelte/store';
//import Favorite from "./favorite.svelte"
import Toc from "./toc.svelte"
import {activePtk,autodict, landscape} from './store.js'
import { usePtk} from "ptk";
export let tofind='';
export let address='';
export let closePopup;
let thetab='toc';
let ptk ,entries=[];

const onDict=async (t)=>{
    const tap_at=t.indexOf('^');
    entries=ptk.columns.entries.keys.findMatches( t.replace('^','')).map(it=>[Math.abs(it[0]-tap_at-1),it[1],it[2]]);
    entries.sort((a,b)=> a[0]-b[0]);// 越接近點擊處的優先
    if (entries.length) {
        showdict=true;
    }
}
const textWidth=(ls)=>{
    if (ls) {
        const w=(screen.height *0.45);
        const r=Math.floor(w*100/screen.width)+1;
        return 'left:'+r+'vw;width:'+(100-r)+'vw';
    }
    return '';
}
$: ls=get(landscape);
$: ptk=usePtk($activePtk);
$: thetab=='dict' && onDict(tofind);
</script>
{#key $landscape}
<div class="popup" style={textWidth(ls)}>
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
        <span class='clickable' class:selected={thetab=="dict"} on:click={()=>thetab="dict"}>🔎{#if ls}查詢{/if}</span>

        

    </div>
    
      <div class="tab-content" class:visible={thetab=='list'}><Foliolist {ptk} {closePopup}/></div>
      
      <div class="tab-content" class:visible={thetab=='toc'}><Toc {address} {closePopup} {ptk} /></div>
      <!-- <div class="tab-content" class:visible={thetab=='favorite'}><Favorite {address} {closePopup} {ptk} /></div> -->
      <div class="tab-content" class:visible={thetab=='textual'}><Textual {closePopup} bind:address {ptk}/></div>
      


      {#if entries.length}
      <div class="tab-content" class:visible={thetab=='dict'}><DictPopup {entries} {ptk} {address}/></div>
      {/if}
      <div class="tab-content" class:visible={thetab=='audio'}><Audio {ptk}/></div>
      <div class="tab-content" class:visible={thetab=='about'}><About/></div>

 </div>
 {/key}
<style>

</style>