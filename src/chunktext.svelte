<script>
export let ptk,start,lineoff ,address;
let ck,lines=[];
const loadChunk=async (line)=>{
    ck=ptk.nearestChunk(line+2);
    await ptk.loadLines([ck.line,ck.lineend]);
    lines=ptk.slice(ck.line,ck.lineend);
}
$: loadChunk(start+lineoff);
const setAddress=(lo)=>{
    const newaddress=address.replace(/:\d+$/,'')+(lo?':'+lo:'');
    if (newaddress) address=newaddress
}
</script>
<div class="toctext">
{#each lines as line,idx}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div on:click={()=>setAddress(idx)} class:activeline={lineoff==idx}>{line}</div>
{/each}

</div>