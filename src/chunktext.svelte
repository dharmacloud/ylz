<script>
export let ptk,start,lineoff ,address;
import {goPb} from './nav.js'
import {tapmark,foliotext} from  './store.js'
import {bsearchNumber, fromBase26} from 'ptk'
import {get} from 'svelte/store'
import ChunkNav from './chunknav.svelte'
let ck,lines=[];

const loadChunk=async (line)=>{
    ck=ptk.nearestChunk(line+2);
    await ptk.loadLines([ck.line,ck.lineend]);
    lines=ptk.slice(ck.line,ck.lineend);
}
$: loadChunk(start+lineoff);
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