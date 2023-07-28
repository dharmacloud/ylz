<script>
import { styledNumber} from "ptk";
import { tapChunkLine,foliotext ,tapmark, activepb} from "./store.js";
export let ptk;
import Pager from './comps/pager.svelte'
let sentnow=0;
let sentences=[]

const gosent=idx=>{
    const ft=$foliotext;
    const fpos=ft.toFolioPos($tapChunkLine.ckid,idx);
    activepb.set(fpos[0])
    tapmark.set(fpos);
    sentnow=idx;
}
const updateSentence=cl=>{
    sentences.length=0;
    for (let i=0;i<cl.linecount;i++) {
        sentences.push({caption:i+1,id:i+1,idx:i})
    }
}
const humancaption=(cl)=>{
    const styled=parseInt(cl.ckid).toString()==cl.ckid?styledNumber(parseInt(cl.ckid),'①'): cl.ckid+'.';
    return styled+ptk.caption(cl.at);
}
// $: getHumanAddress(address)
$: updateSentence($tapChunkLine)
</script>
{humancaption($tapChunkLine)}
<Pager pages={sentences} nextitems={5} previtems={4} now={sentnow} let:active let:caption let:idx>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <span on:click={()=>gosent(idx)} class="clickable" class:selected={active}>{caption}</span>
</Pager>

<!-- {#key humanaddr}
<div class="nav">
<span class="navbutton" on:click={prevSentence}>←</span>
<span class="navbutton"on:click={gotoPb}>{humanaddr}</span>
<span class="navbutton" on:click={nextSentence}>→</span>
</div>
{/key} -->
