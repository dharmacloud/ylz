<script>
import Slider from './3rd/rangeslider.svelte';
import { bsearchNumber ,styledNumber,chunkOfFolio,debounce} from "ptk";
import {activefolio,maxfolio,activebookid} from './store.js';
import {gofolioAt} from './nav.js'
let folio=[$activefolio];
export let ptk;
export let address;
export let closePopup;

let juans=[]; //find out all juan

const setFolio=async (e)=>{
    const v=e.detail[0];
    activefolio.set(parseInt(v));
    address=  'bk#'+$activebookid +'.ck#'+ chunkOfFolio(ptk,$activebookid,v);
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
const gofolio=(ptk,at)=>{
    gofolioAt(ptk,at);
    closePopup();
}
$: tocitems=getTocItems(address);
$: cknow=getCk(address);

</script>
<div  class="toctext">
{#each juans as juan}{juan}{/each}
<span class="jumper">跳到第{ (folio[0]||0)+1}頁 
<Slider bind:value={folio} on:input={debounce(setFolio,500)} max={$maxfolio} min={0} /></span>


<div class="toc">
{#each tocitems as item}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div on:click={()=>gofolio(ptk,item.at)} class="tocitem" class:selecteditem={cknow==item.id}>{styledNumber(item.id,'①') + item.caption}</div>
{/each}
<div class="endmarker">※※※</div>
</div>
</div>

<style>
.jumper {height:10vh}
.toc {overflow-y: auto;height:80vh}
</style>