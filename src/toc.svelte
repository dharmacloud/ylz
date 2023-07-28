<script>
import Slider from './3rd/rangeslider.svelte';
import { bsearchNumber ,styledNumber,debounce} from "ptk";
import {activepb,maxfolio,activefolioid, bookByFolio,foliotext} from './store.js';
import {goPbAt, loadFolio,makeAddressFromFolioPos} from './nav.js'
import Juan from './juan.svelte'
let folio=[parseInt($activepb)-1];
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
    const folioid=ptk.nearestTag(ck.linepos[at],'folio','id');
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
    const p=ft.fromFolioPos($activepb);
    return p[0]
}
$: tocitems=getTocItems($activefolioid);
$: cknow=getCk($activepb);

</script>
<div  class="toctext">
<Juan {ptk} {closePopup}/>
<br/><span class="jumper">跳到第{ (folio[0]||0)+1}頁 
<Slider bind:value={folio} on:input={debounce(setFolio,500)} max={$maxfolio} min={0} /></span>

<div class="toc">
{#each tocitems as item}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div on:click={()=>goBookPb(ptk,item.at)} class="tocitem" class:selecteditem={cknow==item.id}>{styledNumber(item.id,'①') + item.caption}</div>
{/each}
<div class="endmarker">※※※</div>
</div>
</div>

<style>
.jumper {height:10vh}
.toc {overflow-y: auto;height:100%}
</style>