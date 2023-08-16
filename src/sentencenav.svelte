<script>
import { styledNumber} from "ptk";
import { foliotext,tapmark, activepb} from "./store.js";
export let ptk;
import Pager from './comps/pager.svelte'
let sentnow=0;

const gosent=idx=>{
    const ft=$foliotext;
    if (!ft) return;
    const fpos=ft.toFolioPos($foliotext?.fromFolioPos($tapmark).ckid,idx);
    activepb.set(fpos[0])
    tapmark.set(fpos);
    sentnow=idx;
}
let linecount=0,caption='';
const humancaption=()=>{
    const ft=$foliotext;
    if (!ft||!ft.fromFolioPos) return ;
    const cl=ft.fromFolioPos($tapmark);
    if (!cl || !cl.ckid) return ''
    linecount=cl.linecount||0;
    const styled=parseInt(cl.ckid).toString()==cl.ckid?styledNumber(parseInt(cl.ckid),'①'): (cl.ckid||'')+'.';
    caption= styled+ptk.caption(cl.at);
    console.log(caption,linecount)
}
$: humancaption($tapmark);
</script>
<Pager {caption} count={linecount} nextitems={5} previtems={4} now={sentnow} onselect={gosent} let:active let:caption let:idx>
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
