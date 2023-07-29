<script>
import Slider from './3rd/rangeslider.svelte';
import { bsearchNumber ,styledNumber,debounce} from "ptk";
import {activepb,maxfolio,activefolioid, bookByFolio,foliotext} from './store.js';
import {goPbAt, loadFolio} from './nav.js'
import Juan from './juan.svelte'
$: folio=[parseInt($activepb)-1];
export let ptk;
export let closePopup;

const setFolio=async (e)=>{
    const v=((e.detail[0]||0)+1).toString();
    activepb.set(v);
}

let tocitems=[],cknow;
const getTocItems=()=>{
    const out=[];
    const bk=bookByFolio($activefolioid);
    const bookaddr='bk#'+bk;
    const [from,to]=ptk.rangeOfAddress(bookaddr);
    
    const ck=ptk.defines.ck;
    const at=bsearchNumber (ck.linepos, from);
    const at2=bsearchNumber (ck.linepos, to);
    for (let i=at;i<at2;i++) {
        out.push({caption:ck.innertext.get(i),at:i,id:ck.fields.id.values[i]});
    }
    return out;
}

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
const getCk=()=>{
    const ft=$foliotext;
    if (!ft||!ft.fromFolioPos) return '';
    const {ckid}=ft.fromFolioPos($activepb);
    return ckid;
}
$: tocitems=getTocItems($activefolioid);
$: cknow=getCk($activepb);

</script>
<div  class="toctext">
<Juan {ptk} {closePopup}/>
<Slider bind:value={folio} on:input={debounce(setFolio,500)} max={$maxfolio} min={0} >
    <span slot="caption" style="float:right">折{(folio[0]||0)+1}/{$maxfolio+1}</span></Slider>

<div class="toc">
{#each tocitems as item}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div on:click={()=>goBookPb(ptk,item.at)} class="tocitem" class:selecteditem={cknow==item.id}>{styledNumber(item.id,'①') + item.caption}</div>
{/each}
<div class="endmarker">※※※</div>
</div>
</div>

<style>

.toc {overflow-y: auto;height:100%}
</style>