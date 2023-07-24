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
    if (entries.length && $autodict=='on') {
        showdict=true;
        showmainmenu=false;
        thetab='dict'
    } else if (~address.indexOf('ck')) {
        thetab='textual';
    }
}
const textWidth=(ls)=>{
    if (ls) {
        const w=(screen.height *0.45);
        return 'left:'+w+'px;width:'+(screen.width-w)+'px';
    }
    return '';
}
$: ptk=usePtk($activePtk);
$: onDict(tofind)
</script>
<div class="popup" style={textWidth(get(landscape))}>
    <div class="tabs">    
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <span class='clickable' class:selected={thetab=="about"} on:click={()=>thetab="about"}>⚙️</span>

        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <span class='clickable' class:selected={thetab=="list"} on:click={()=>thetab="list"}>📚</span>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <span class='clickable' class:selected={thetab=="toc"} on:click={()=>thetab="toc"}>🧭</span>
        
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <span class='clickable' class:selected={thetab=="textual"} on:click={()=>thetab="textual"}>📜</span>    
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <span class='clickable' class:selected={thetab=="audio"} on:click={()=>thetab="audio"}>🎵</span>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- <span class='clickable' class:selected={thetab=="favorite"} on:click={()=>thetab="favorite"}>❤️</span> -->
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        {#if entries.length} <span class='clickable' class:selected={thetab=="dict"} on:click={()=>thetab="dict"}>🔎</span>{/if}

        

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
<style>

</style>