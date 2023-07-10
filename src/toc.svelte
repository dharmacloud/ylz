<script>
import Slider from './3rd/rangeslider.svelte';
import { bsearchNumber ,styledNumber,chunkOfFolio,debounce} from "ptk";
import {activepb,maxfolio,activefolioid} from './store.js';
import {goPbAt} from './nav.js'
import Juan from './juan.svelte'
let folio=[$activepb];
export let ptk;
export let address;
export let closePopup;

const setFolio=async (e)=>{
    const v=e.detail[0];
    activepb.set(parseInt(v));
    address=  'bk#'+$activefolioid +'.ck#'+ chunkOfFolio(ptk,$activefolioid,v);
}

let tocitems=[],cknow;
const getTocItems=address=>{
    const out=[];
    if (!address) return out;
    const m=address.match(/(bk#?[a-z_\d]+)/);
    const [from,to]=ptk.rangeOfAddress(m[1]);
    const ck=ptk.defines.ck;
    const at=bsearchNumber (ck.linepos, from);
    const at2=bsearchNumber (ck.linepos, to);
    for (let i=at;i<at2;i++) {
        out.push({caption:ck.innertext.get(i),at:i,id:ck.fields.id.values[i]});
    }
    return out;
}
const getCk=(address)=>{
    const m=address.match(/ck#?(\d+)/);
    if (m) return m[1];
}
const goPb=(ptk,at)=>{
    goPbAt(ptk,at);
    closePopup();
}
$: tocitems=getTocItems(address);
$: cknow=getCk(address);

</script>
<div  class="toctext">

<Juan {ptk} {closePopup}/>
<span class="jumper">跳到第{ (folio[0]||0)+1}頁 
<Slider bind:value={folio} on:input={debounce(setFolio,500)} max={$maxfolio} min={0} /></span>

<div class="toc">
{#each tocitems as item}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div on:click={()=>goPb(ptk,item.at)} class="tocitem" class:selecteditem={cknow==item.id}>{styledNumber(item.id,'①') + item.caption}</div>
{/each}
<div class="endmarker">※※※</div>
</div>
</div>

<style>
.jumper {height:10vh}
.toc {overflow-y: auto;height:80vh}
</style>