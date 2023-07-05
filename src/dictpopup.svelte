<script>
export let entries=[],ptk,wikipedia,fgdzd,dfb;
let nentry=0;
let src='';
const setWikipedia=()=>{
    const entry=entries[nentry][1];
    src="https://zh.wikipedia.org/wiki/"+ entry;
}
const setOneline=()=>{
    const entry=entries[nentry][1];
    src="http://buddhaspace.org/dict/index.php?keyword="+ entry;
}
const availableDict=(n)=>{
    const at=entries[n][2];
    const flag=ptk.columns.entries.dict[at];
    wikipedia=flag&1;
    fgdzd=flag&2;
    dfb=flag&4;
}
$: availableDict(nentry)
</script>
<div class="dictpopup toctext">
<span class="header">
{#each entries as [distance,entry],idx}
<span class:dictgroup={idx==nentry}>
<label><input  type='radio' bind:group={nentry} name='dict' value={idx}/>{entry}</label>
{#if idx==nentry}
{#if fgdzd||dfb}<button on:click={setOneline}>一行</button>{/if}
{#if wikipedia}<button on:click={setWikipedia}>Wiki</button>{/if}
<a target=_new href={"https://www.google.com/search?q="+entry}>Google</a>
{/if}
</span>
{/each}
</span>

{#if src}
<iframe class="iframe" title="wiki" {src}></iframe>
{/if}
</div>
<style>
.dictpopup {height:100%;overflow:hidden;display:flex;flex-flow:column}
.iframe { flex: 1 1 auto;}
.header {flex: 0 1 auto;}
</style>