<script>
export let ptk,start,lineoff ,address;
import {goPb} from './nav.js'
import {tapmark,foliotext} from  './store.js'
import {bsearchNumber} from 'ptk'
import {get} from 'svelte/store'
import ChunkNav from './chunknav.svelte'
let ck,lines=[];

const loadChunkText=async (line)=>{
    ck=ptk.nearestChunk(line+2);
    if (!ck) return;
    await ptk.loadLines([ck.line,ck.lineend]);
    lines=ptk.slice(ck.line,ck.lineend);
}

const scrolltoview=()=>{
    setTimeout(()=>{
        let ele=document.getElementsByClassName("activeline")[0];
        if (ele) {
            if (ele.previousElementSibling) {
                ele=ele.previousElementSibling;
            }
            ele.parentElement.parentElement.parentElement.scrollTop = ele.offsetTop;
            //scrollIntoView will hide the tabbar
        }
        
    },150)
}
$: loadChunkText(start+lineoff,address);
$: scrolltoview(address);
const renderLine=line=>{
    return line.replace(/\^[a-z]#?[a-z\d]*/g,'');
}
const setAddress=(lo)=>{
    const newaddress=address.replace(/:\d+$/,'')+(lo?':'+lo:'');
    if (newaddress && address!==newaddress) {
        address=newaddress;
        const pb=ptk.defines.pb;
        const at=bsearchNumber (pb.linepos,start+lo)-1 ;
        const pbid=pb.fields.id.values[at];
        goPb(pbid,ck.id,lo);
        const foliopos= get(foliotext).toFolioPos(  ck.id,lo);
        tapmark.set(foliopos);
    }
}
</script>
<div class="toctext">
<ChunkNav {ptk} bind:address {ck}/>
{#each lines as line,idx}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div on:click={()=>setAddress(idx)} class:activeline={lineoff==idx}>{@html renderLine(line)}</div>
{/each}

</div>