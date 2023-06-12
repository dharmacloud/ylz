<script>
import { bsearchNumber ,styledNumber,chunkOfFolio} from "ptk";
import {activefolio,activebookid} from './store.js'
export let ptk;
export let address;
export let closePopup;
export let pbid;
let tocitems=[],cknow;
const getTocItems=address=>{
    const m=address.match(/(bk#?[a-z_\d]+)/);
    const out=[];
    const [from,to]=ptk.rangeOfAddress(m[1]);
    const ck=ptk.defines.ck;
    const at=bsearchNumber (ck.linepos, from);
    const at2=bsearchNumber (ck.linepos, to);
    for (let i=at;i<at2;i++) {
        out.push({caption:ck.innertext.get(i),at:i,id:ck.fields.id.values[i]});
    }
    return out;
}
const gofolio=(at)=>{
    const ck=ptk.defines.ck;
    const pb=ptk.defines.pb;
    const ckline=ck.linepos[at];
    const pbtag=ptk.nearestTag(ckline+1,'pb')-1;
    const pbid=pb.fields.id.values[pbtag];
    activefolio.set( parseInt(pbid)-1);
    closePopup();
}

$: tocitems=getTocItems(address);
$: cknow=address.match(/ck#?(\d+)/)[1];
</script>
<div  class="toctext">
{#each tocitems as item}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div on:click={()=>gofolio(item.at)} class="tocitem" class:selecteditem={cknow==item.id}>{styledNumber(item.id,'①') + item.caption}</div>
{/each}
<div class="endmarker">※※※</div>
</div>