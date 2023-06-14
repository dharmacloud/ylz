<script>
import { bsearchNumber, makeAddress, parseAction, parseAddress ,rangeOfAddress,styledNumber} from "ptk";

export let ptk;
export let address;
let humanaddr='', hl,addr,act,chunklines,ckid;
let maxchunk=0;
const getHumanAddress=async (address)=>{
    addr=parseAddress(address);
    hl=addr.highlightline;
    act=parseAction(addr.action);
    const r=ptk.rangeOfAddress(act[0].join('#'));
    const ck=ptk.defines.ck;
    const at=bsearchNumber( ck.linepos,r[1] )-1;
    maxchunk=parseInt(ck.fields.id.values[at]);
    ckid=parseInt(act[act.length-1][1]); //should be ck
    humanaddr= styledNumber(ckid)+(hl?hl:'');
    chunklines=await ptk.fetchAddress(addr.action);
}
const nextSentence=()=>{
    let action=addr.action;
    if (hl<chunklines.length-1) {
        hl++;
    } else {
        if (ckid<maxchunk) {
            action=act[0].join('#')+'.ck#'+(ckid+1);
            hl=1;//hide the chunk line
        }
    }
    address=makeAddress('',action,0,0,hl);
}
const prevSentence=async ()=>{
    let action=addr.action;
    if (hl>1) {
        hl--;
    } else {
        if (ckid>1) {
            action=act[0].join('#')+'.ck#'+(ckid-1);
            chunklines=await ptk.fetchAddress(action);
            hl=chunklines.length-1;
        }
    }
    address=makeAddress('',action,0,0,hl);
}
$: getHumanAddress(address)
</script>
{#key humanaddr}
<div class="nav">
<!-- svelte-ignore a11y-click-events-have-key-events -->
<span on:click={prevSentence} class="toctext">←</span>
{humanaddr}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<span class="toctext" on:click={nextSentence}>→</span>
</div>
{/key}

<style>
.nav {width:100%;text-align: center;}
</style>