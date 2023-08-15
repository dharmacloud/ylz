<script>
import { styledNumber} from "ptk";
import { tapChunkLine,foliotext ,tapmark, activepb} from "./store.js";
export let ptk;
import Pager from './comps/pager.svelte'
let sentnow=0;

const gosent=idx=>{
    const ft=$foliotext;
    const fpos=ft.toFolioPos($tapChunkLine.ckid,idx);
    activepb.set(fpos[0])
    tapmark.set(fpos);
    sentnow=idx;
}
const humancaption=(cl)=>{
    if (!cl || !cl.ckid) return ''
    const styled=parseInt(cl.ckid).toString()==cl.ckid?styledNumber(parseInt(cl.ckid),'①'): (cl.ckid||'')+'.';
    return styled+ptk.caption(cl.at);
}

// $: getHumanAddress(address)
</script>
<Pager caption={humancaption($tapChunkLine)} count={$tapChunkLine.linecount} nextitems={5} previtems={4} now={sentnow} onselect={gosent} let:active let:caption let:idx>
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
