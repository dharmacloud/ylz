<script>
import DictPopup from "./dictpopup.svelte"
import Foliolist from "./foliolist.svelte"
import Audio from "./audio.svelte"
import About from "./about.svelte"
import Textual from './textual.svelte'
import Favorite from './favorite.svelte'
import Sharing from './sharing.svelte'
import Toc from "./toc.svelte"
import {_} from './textout.js'
import {thetab,activePtk, landscape,sideWidth,searchable,mediaurls,sharing,tosim,hasupdate, showfavorite} from './store.js'
import { usePtk} from "ptk";
import {CURSORMARK} from './nav.js'
export let tofind='';
export let closePopup;
if (!navigator.onLine && $thetab=='dict') $thetab='list' ;
let entries=[];

const onDict=(t)=>{
    const tap_at=t.indexOf(CURSORMARK);
    const ptk=usePtk($activePtk);
    entries=ptk.columns.entries?.keys.findMatches( t.replace(CURSORMARK,'')).map(it=>[Math.abs(it[0]-tap_at-1),it[1],it[2]])||[];
    entries.sort((a,b)=> a[0]-b[0]);// 越接近點擊處的優先
    //showdict=true;
}
const setSearchable=t=>{
    const tap_at=t.indexOf(CURSORMARK);
    searchable.set(t.slice(tap_at+1));
}
/*
const copyaddress=async ele=>{
    await navigator.clipboard.writeText(tapAddress());
    ele.target.innerHTML='copied';
    setTimeout(()=>{
        ele.target.innerHTML=tapAddress();
    },2000)
}
*/
$: ls=$landscape;
$: setSearchable(tofind);
$: $thetab=='dict' && onDict(tofind);
$: if ($sharing) thetab.set('dict');
</script>
{#key $landscape}
<div class="popup" style={ls?sideWidth(ls):''}>
    <div class="tabs">    
        <span aria-hidden="true" class='clickable' class:needupdate={$hasupdate} class:selected={$thetab=="about"} on:click={()=>thetab.set("about")}>⚙️{#if ls}首{/if}</span>
        <span aria-hidden="true" class='clickable' class:selected={$thetab=="list"} on:click={()=>thetab.set("list")}>📚{#if ls}{_("錄",$tosim)}{/if}</span>
        <span aria-hidden="true" class='clickable' class:selected={$thetab=="toc"} on:click={()=>thetab.set("toc")}>🧭{#if ls}目{/if}</span>
        {#if $showfavorite=='on'}
        <span aria-hidden="true" class='clickable' class:selected={$thetab=="favorite"} on:click={()=>thetab.set("favorite")}>❤️{#if ls}愛{/if}</span>
        {/if}
        <span aria-hidden="true" class='clickable' class:selected={$thetab=="textual"} on:click={()=>thetab.set("textual")}>📃{#if ls}文{/if}</span>    
        <!--<span aria-hidden="true" class='clickable' class:selected={$thetab=="dict"} on:click={()=>thetab.set("dict")}>
        {#if $sharing}    
            🔗{#if ls}{_("鏈",$tosim)}{/if}
        {:else}
            🔠{#if ls}{_("詞",$tosim)}{/if}
        {/if}
        
        </span>
-->
        {#if $mediaurls.length>1}
        <span aria-hidden="true" class='clickable' class:selected={$thetab=="audio"} on:click={()=>thetab.set("audio")}>📣{#if ls}{_("誦",$tosim)}{/if}</span>
        {/if}

    </div>
      <div class="tab-content" class:visible={$thetab=='list'}><Foliolist {closePopup}/></div>
      <div class="tab-content" class:visible={$thetab=='toc'}><Toc {closePopup}  /></div>
      {#if $showfavorite=='on'}
      <div class="tab-content" class:visible={$thetab=='favorite'}><Favorite {closePopup} /></div>
      {/if}
      <div class="tab-content" class:visible={$thetab=='textual'}><Textual {closePopup} /></div>

      <!--
      {#if $sharing}
      <div class="tab-content" class:visible={$thetab=='dict'}><Sharing/></div>
      {:else}
      <div class="tab-content" class:visible={$thetab=='dict'}><DictPopup {entries}/></div>
      {/if}
      -->

      <div class="tab-content" class:visible={$thetab=='audio'}><Audio /></div>
      <div class="tab-content" class:visible={$thetab=='about'}><About/></div>

 </div>
 {/key}
<style>

</style>