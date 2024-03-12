<script>
import Slider from './3rd/rangeslider.svelte';
import { bsearchNumber ,styledNumber,debounce, usePtk} from "ptk";
import {activePtk,tosim,activepb,maxfolio,activefolioid,loadingfolio,foliotext} from './store.js';
import {goPbAt, loadFolio} from './nav.js'
import Endmarker from './endmarker.svelte';
import {_} from './textout.js'
import Juan from './juan.svelte'
import {getTocItems} from './folio.js';
$: folio=[parseInt($activepb),0];
$: ptk=usePtk($activePtk)
export let closePopup;
const setFolio=async (e)=>{
    if ($loadingfolio) return;
    const v=((e.detail[0]||1)).toString();
    if ($activepb!==v) {
        activepb.set(v);
    }
}

let tocitems=[],cknow;


const goBookPb=(ptk,at)=>{
    const ck=ptk.defines.ck;
    const folioid=ptk.nearestTag(ck.linepos[at]+1,'folio','id');
    if (folioid!==$activefolioid) {
        loadFolio(folioid,()=>{
            goPbAt(ptk,at);
        })
    } else {        
        goPbAt(ptk,at);
    }    
}
const getCk=(pb,loading)=>{
    if (loading) return '';
    const ft=$foliotext;
    if (!ft||!ft.fromFolioPos) return '';
    const {ckid}=ft.fromFolioPos($activepb);
    return ckid;
}
$: tocitems=getTocItems(ptk,$activefolioid,$loadingfolio);
$: cknow=getCk($activepb,$loadingfolio);
</script>
<div  class="bodytext">
{#if !$loadingfolio}
<Juan {closePopup}/>
<Slider bind:value={folio} on:input={debounce(setFolio,800)} max={$maxfolio} min={1} >
    <span slot="caption" style="float:right">折{(folio[0]||1)}/{$maxfolio}</span></Slider>
<div class="toc">
{#key $tosim}
{#each tocitems as item}
<div aria-hidden="true" on:click={()=>goBookPb(ptk,item.at)} class="tocitem" 
    class:selecteditem={cknow==item.id}>{styledNumber(item.id,'①') + _(item.caption)}</div>
{/each}
{/key}
<Endmarker/>
</div>
{:else}
載入中
{/if}
</div>
<style>

.toc {overflow-y: auto;height:100%}
</style>