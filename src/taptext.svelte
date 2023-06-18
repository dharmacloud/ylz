<script>
import DictPopup from "./dictpopup.svelte"
import Foliolist from "./foliolist.svelte"
import Setting from "./setting.svelte"
import Translations from "./translations.svelte"
import Variorum from "./variorum.svelte"
import Toc from "./toc.svelte"
import {activePtk} from './store.js'
import {guessEntry ,usePtk} from "ptk";
export let tofind='';

export let address='';
export let closePopup;
let thetab='toc';
let def='',ptk;

const onDict=async (t)=>{
    const entry=guessEntry( t,ptk.defines.e.fields.id.values);
    const defs=await ptk.fetchAddress('e#'+entry);
    if (defs.length) {
        def=defs.join('\n')
        showdict=true;
        showmainmenu=false;
        thetab='dict'
    } else if (~address.indexOf('ck')) {
        thetab='translations'
    }
}
$: ptk=usePtk($activePtk);
$: onDict(tofind)
</script>
<div class="popup">
    <div class="tabs">    
        <!-- <span class='clickable' class:selected={thetab=="library"} on:click={()=>maintab.set("library")}>📚</span> -->
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <span class='clickable' class:selected={thetab=="list"} on:click={()=>thetab="list"}>經</span>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <span class='clickable' class:selected={thetab=="toc"} on:click={()=>thetab="toc"}>分</span>

        {#if ~address.indexOf('ck')}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <span class='clickable' class:selected={thetab=="translations"} on:click={()=>thetab="translations"}>譯</span>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <span class='clickable' class:selected={thetab=="variorum"} on:click={()=>thetab="variorum"}>註</span>
        {/if}
        {#if def}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <span class='clickable' class:selected={thetab=="dict"} on:click={()=>thetab="dict"}>詞</span>
        {/if}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <span class='clickable' class:selected={thetab=="setting"} on:click={()=>thetab="setting"}>設</span>

    </div>
    
      <div class="tab-content" class:visible={thetab=='list'}><Foliolist {ptk} {closePopup}/></div>
      
      <div class="tab-content" class:visible={thetab=='toc'}><Toc {address} {closePopup} {ptk} /></div>
      <div class="tab-content" class:visible={thetab=='translations'}><Translations {closePopup} bind:address {ptk}/></div>
      <div class="tab-content" class:visible={thetab=='variorum'}><Variorum {closePopup} bind:address {ptk}/></div>


      {#if def}
      <div class="tab-content" class:visible={thetab=='dict'}><DictPopup {def} {ptk}/></div>
      {/if}
      <div class="tab-content" class:visible={thetab=='setting'}><Setting/></div>

 </div>
<style>

</style>