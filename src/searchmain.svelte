<script>
import { splitUTF32Char ,listExcerpts, parseOfftext, bsearchNumber} from 'ptk';
import { leftmode, searchable, tofind} from './store.js'
import { goPtkLine } from './nav.js';
import SearchHelp from './searchhelp.svelte'
import Pager from './comps/pager.svelte';
export let ptk;
let items=[], theinput, activeidx=-1, value='',
excerpts=[],chunkhits=[],
selected=-1,pagecount=0,selecteditem=-1;
let scopes=[];
let allexcerpts=[], allchunkhits=[], allpostings=[];
let now=0;
const PERPAGE=10;
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
let inputtimer=0;
const onchange=()=>{
    activeidx=-1;
    clearTimeout(inputtimer);
    inputtimer=setTimeout(()=>{
        tofind.set(value);
    },250);
}
const dosearch=()=>{
    excerpts.length=0;
    if (activeidx>-1) {
        tf=items.slice(0,activeidx+1).join('');
    } else tf=value;

    ptk.scanText(tf).then(res=>{
		scopes=res;
        if (scopes.length) {
            setScope(1);
        }
	});
}

// add 本卷(本經)
const setScope=async (idx)=>{
    selected=idx;
    pagecount=0;
    const at=Math.floor(idx/2);
    const {lines,chunks,postings}=await listExcerpts(ptk,tf, scopes[at].scope);
    allpostings=postings;
    if (selected%2==0) {
        allchunkhits=chunks.map(it=>{
            return {
                ck:ptk.getChunk(it[0]),
                hits:it[1]
            }
        })       
        pagecount=Math.floor(allchunkhits.length /PERPAGE)+1; 
        gopage(0)
    } else {
        allexcerpts=lines;
        pagecount=Math.floor(allexcerpts.length /PERPAGE)+1;
        gopage(0)
    }
}
const gopage=async idx=>{
    excerpts.length=0;
    chunkhits.length=0;
    selecteditem=-1;
    if (selected%2==0) {
        chunkhits=allchunkhits.slice(idx*PERPAGE,(idx+1)*PERPAGE);
        pagecount=Math.floor(allchunkhits.length /PERPAGE)+1;
    } else {
        const toload=[];
        for (let i=idx*PERPAGE;i<(idx+1)*PERPAGE && i<allexcerpts.length;i++) {
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
        pagecount=Math.floor(allexcerpts.length /10)+1;
    }
    excerpts=excerpts;
    chunkhits=chunkhits;
    now=idx;
}

const go=(idx)=>{
    let line=allexcerpts[idx][0];
    if (selected%2==0) { //goto first hit of the chunk
        //todo , click chunk hit to show excepts
        const tlp = ptk.inverted.tokenlinepos;
        const chunktokenpos=tlp[allchunkhits[idx].ck.line];        
        const at=bsearchNumber(allpostings[0],chunktokenpos);
        const closest= allpostings[0][at];
        line=bsearchNumber(tlp, closest)-1;
    }
    goPtkLine(ptk, line);
    leftmode.set('folio')
    selecteditem=idx;
}
const onfocus=()=>{
    activeidx=-1;
    leftmode.set('input')
}
const onblur=()=>{
    setTimeout(()=>{
        leftmode.set('folio')
    },200);
}
$: makeSearchable($searchable)
$: dosearch( value, activeidx,$searchable)
</script>
<div class="toctext">
<input class="tofind" placeholder="輸入區" size={8} class:diminput={activeidx>-1} bind:this={theinput} 
on:focus={onfocus} on:blur={onblur} on:input={onchange} bind:value id="tofind"/>
{#each items as item,idx}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<span class="searchable" class:selectedsearchable={idx<=activeidx} on:click={()=>setInput(idx)}>{item}</span>
{/each}
{#if !items.length}【候選區】{/if}
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
<div class="pager">
<Pager count={pagecount} bind:now onselect={gopage} let:idx let:caption let:active>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <span on:click={()=>gopage(idx)} class="clickable" class:selected={active}>{caption}</span>
</Pager>
</div>
<div class="toctext">


{#each excerpts as excerpt,idx}
<div class="excerptline" class:oddline={idx%2==0}>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<span class="excerptseq clickable" class:selected={selecteditem==idx} on:click={go(idx+(now*PERPAGE))}>{idx+(now*PERPAGE)+1}←</span>
{excerpt.puretext}</div>
{/each}

{#each chunkhits as chit,idx}
<div class="excerptline" class:oddline={idx%2==0}>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<span class="excerptseq clickable" class:selected={selecteditem==idx} on:click={go(idx+(now*PERPAGE))}>{idx+(now*PERPAGE)+1}←</span>
{chit.ck.bk?.caption}/{chit.ck.caption}<span class="hit">{" "+chit.hits}</span></div>
{/each}


</div>

<div class="pager">
<Pager count={pagecount} bind:now  onselect={gopage} let:idx let:caption let:active>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <span on:click={()=>gopage(idx)} class="clickable" class:selected={active}>{caption}</span>
</Pager>
</div>

{/if}
<style>
input{font-size:1em}
</style>