<script>
import { bsearchNumber, makeAddress, parseAction, parseAddress ,styledNumber} from "ptk";
import { activepb } from "./store";
export let ptk;
export let address='';

let humanaddr='', chunklines,ckid;
let maxchunk=0;
const actionOfAddress=(address)=>{
    const addr=parseAddress(address);
    const hl=addr.highlightline;
    const act=parseAction(addr.action);
    const ckrange=ptk.rangeOfAddress(act[0].join('#'));
    const range=ptk.rangeOfAddress(address);
    return {addr,act,action:addr.action,ckrange,range,hl}
}
const getHumanAddress=async (address)=>{
    const {action,act,ckrange,hl}=actionOfAddress(address);
    const ck=ptk.defines.ck;
    const at=bsearchNumber( ck.linepos,ckrange[1] )-1;
    maxchunk=parseInt(ck.fields.id.values[at]);
    ckid=parseInt(act[act.length-1][1]); //should be ck
    humanaddr= styledNumber(ckid)+(hl?'#'+hl:'');
    chunklines=await ptk.fetchAddress(action);
}
const nextSentence=()=>{
    let {addr,act,hl}=actionOfAddress(address);
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
    let {hl,act,action}=actionOfAddress(address);
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
const gotoPb=()=>{
    const {act,hl,range}=actionOfAddress(address);

    const pb=ptk.defines.pb;
    const at=bsearchNumber( pb.linepos,range[0]-1+hl )-1;

    activepb.set(pb.fields.id.values[at]||0);

    // console.log(at,'pbid', );
}
$: getHumanAddress(address)
</script>
{#key humanaddr}
<div class="nav">
<!-- svelte-ignore a11y-click-events-have-key-events -->
<span class="navbutton" on:click={prevSentence}>←</span>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<span class="navbutton"on:click={gotoPb}>{humanaddr}</span>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<span class="navbutton" on:click={nextSentence}>→</span>
</div>
{/key}
