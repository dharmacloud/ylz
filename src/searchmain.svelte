<script>
import { splitUTF32Char ,listExcepts, parseOfftext} from 'ptk';
import {searchable} from './store.js'
import SearchHelp from './searchhelp.svelte'
import Pager from './comps/pager.svelte';
export let ptk;
let items=[], theinput, activeidx=-1, value='',excerpts=[],selected=-1,excerptpagecount=0;
let scopes=[];
let allexcerpts=[];
const makeSearchable=t=>{
    items.length=0;
    const chars=splitUTF32Char(t);
    for (let i=0;i<chars.length;i++) {
        items.push(chars[i]);
    }
    if (items.length>=2) activeidx=2;
    else if (items.length==1) activeidx=0;
    else if (items.length==0) activeidx=-1;
}
const setInput=idx=>{
    let tf='';
    for (let i=0;i<=idx;i++) {
        tf+=items[i]||''
    }
    if (idx==activeidx) {
        if (value==tf) {
            value='';
        } else {
            value=tf
            activeidx=-1;
        }
    } else {
        activeidx=idx;
    }
}
const onchange=()=>{
    activeidx=-1;
}
const dosearch=()=>{
    excerpts.length=0;
    if (activeidx>-1) {
        tf=items.slice(0,activeidx+1).join('');
    } else tf=value;

    ptk.scanText(tf).then(res=>{
		scopes=res.filter(it=>it.count);
        if (scopes.length) {
            setScope(1)
        }
	});
}
const setScope=async (idx)=>{
    selected=idx;
    excerptpagecount=0;
    const at=Math.floor(idx/2);
    const {lines,chunks}=await listExcepts(ptk,tf, scopes[at].scope);
    if (selected%2==0) {
        
    } else {
        allexcerpts=lines;
        excerptpagecount=Math.floor(lines /10)+1;
        gopage(0)
    }
}
const gopage=async idx=>{
    excerpts=[];
    const toload=[];
    for (let i=idx*10;i<(idx+1)*10 && i<allexcerpts.length;i++) {
        const line=allexcerpts[i][0];
        toload.push( line);
    }
    await ptk.loadLines(toload);
    for (let i=0;i<toload.length;i++) {
        const line=toload[i];
        const linetext=ptk.getLine(line);
        [puretext]=parseOfftext(linetext);
        excerpts.push({puretext,linetext, line});
    }
    console.log(excerpts)
    excerpts=excerpts;
}
$: makeSearchable($searchable)

$: dosearch( value, activeidx,$searchable)
</script>
<div class="toctext">
<input class:diminput={activeidx>-1} bind:this={theinput} on:input={onchange} bind:value id="tofind"/>
{#each items as item,idx}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<span class="searchable" class:selectedsearchable={idx<=activeidx} on:click={()=>setInput(idx)}>{item}</span>
{/each}
</div>
{#if value=='' && activeidx==-1}
<SearchHelp/>
{:else}
<div class="toctext">
{#each scopes as scope,idx}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<span class="scopebtn" on:click={()=>setScope(idx*2)} class:selected={idx*2==selected}>{scope.caption}</span><!-- svelte-ignore a11y-click-events-have-key-events --><span class="hitbtn" on:click={()=>setScope(idx*2+1)} class:selected={1+idx*2==selected}>{scope.count}</span>
{/each}
</div>
<div class="toctext">
<Pager count={excerptpagecount} onselect={gopage} let:idx let:caption let:active>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <span on:click={()=>gopage(idx)} class="clickable" class:selected={active}>{caption}</span>
</Pager>
{#each excerpts as excerpt}
<div class="excerptline">{excerpt.puretext}</div>
{/each}
</div>

{/if}
<style>
input{font-size:1em;size:6}
</style>