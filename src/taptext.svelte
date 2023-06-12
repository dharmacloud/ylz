<script>
import DictPopup from "./dictpopup.svelte"
import Translations from "./translations.svelte"
import Toc from "./toc.svelte"
import {guessEntry } from "ptk";
export let tofind='';
export let ptk;
export let address='';
export let closePopup;
let thetab='translations';
let def='';
const onDict=async (t)=>{
    const entry=guessEntry( t,ptk.defines.e.fields.id.values);
    const defs=await ptk.fetchAddress('e#'+entry);
    if (defs.length) {
        def=defs.join('\n')
        showdict=true;
        showmainmenu=false;
        thetab='dict'
    }
}
$: onDict(tofind)
</script>
<div class="popup">
    <div class="tabs">    
        <!-- <span class='clickable' class:selected={thetab=="library"} on:click={()=>maintab.set("library")}>📚</span> -->
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <span class='clickable' class:selected={thetab=="toc"} on:click={()=>thetab="toc"}>目錄</span>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <span class='clickable' class:selected={thetab=="translations"} on:click={()=>thetab="translations"}>別譯</span>
        {#if def}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <span class='clickable' class:selected={thetab=="dict"} on:click={()=>thetab="dict"}>字典</span>
        {/if}
      </div>
    
      <div class="tab-content" class:visible={thetab=='toc'}><Toc/></div>
      <div class="tab-content" class:visible={thetab=='translations'}><Translations {closePopup} {address} {ptk}/></div>
      {#if def}
      <div class="tab-content" class:visible={thetab=='dict'}><DictPopup {def} {ptk}/></div>
      {/if}
</div>
<style>

</style>