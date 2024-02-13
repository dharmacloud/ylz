<script>
import { splitUTF32Char } from 'ptk';
import { addTofind, leftmode, searchable, tofind} from './store.js'
import { goPtkLine } from './nav.js';
import SearchHelp from './searchhelp.svelte'

import {_} from './textout.js'
import Endmarker from './endmarker.svelte';
import Excerpt from './excerpt.svelte'
export let ptk;
let items=[], theinput, activeidx=-1, value='';
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
let tf='';
const setInput=idx=>{
    tf='';
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
    tofind.set(tf)
}
let inputtimer=0;
const onchange=()=>{
    activeidx=-1;
    clearTimeout(inputtimer);
    inputtimer=setTimeout(()=>{
        tofind.set(value);
    },250);
}

const goLine=(line,choff=0)=>{
    goPtkLine(ptk, line,choff);
    leftmode.set('folio')
    addTofind(value);
}

/*
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
const setScope=async (idx,range)=>{
    selected=idx;
    pagecount=0;
    const at=Math.floor(idx/2);
    if (!range) {
        rangecaption='';
    }
    const {lines,chunks,postings}=await listExcerpts(ptk,tf, {range:range||scopes[at].scope});
    allpostings=postings;
    if (selected%2==0) {
        allchunkhits=chunks.map(it=>{
            return {
                ck:ptk.getChunk(it[0]),
                hits:it[1]
            }
        })       
        pagecount=Math.floor(allchunkhits.length /ITEMPERPAGE)+1; 
        gopage(0)
    } else {
        allexcerpts=lines;
        pagecount=Math.floor(allexcerpts.length /ITEMPERPAGE)+1;
        gopage(0)
    }
}
const gopage=async idx=>{
    excerpts.length=0;
    chunkhits.length=0;
    selecteditem=-1;
    if (selected%2==0) {
        chunkhits=allchunkhits.slice(idx*ITEMPERPAGE,(idx+1)*ITEMPERPAGE);
        pagecount=Math.floor(allchunkhits.length /ITEMPERPAGE)+1;
    } else {
        const toload=[];
        for (let i=idx*ITEMPERPAGE;i<(idx+1)*ITEMPERPAGE && i<allexcerpts.length;i++) {
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
*/

/*
const go=(idx)=>{
    let line=allexcerpts[idx][0];
    goLine(line);
    selecteditem=idx;
}
 const gock=(idx)=>{
     const chit=chunkhits[idx]
     const line=chit.ck.line;
     goLine(line);
     selecteditem=idx;
 }
const setChunkScope=(ck)=>{
    const rangeaddr='bk#'+ck.bk.id+'.ck#'+ck.id;
    rangecaption=(ck.bk?.caption||'')+'/'+ck.caption;
    setScope(selected*2+1,rangeaddr);
}


*/
const onblur=()=>{
    setTimeout(()=>{
        leftmode.set('folio')
    },200);
}
const onfocus=()=>{
    activeidx=-1;
    leftmode.set('input')
}
$: makeSearchable($searchable)
//$: dosearch( value, activeidx,$searchable)
</script>
<div class="bodytext">
<input class="tofind" placeholder={_("輸入區")} size={8} class:diminput={activeidx>-1} bind:this={theinput} 
on:focus={onfocus} on:blur={onblur} on:input={onchange} bind:value id="tofind"/>
{#each items as item,idx}
<span aria-hidden="true" class="searchable" class:selectedsearchable={idx<=activeidx} on:click={()=>setInput(idx)}>{_(item)}</span>
{/each}
{#if !items.length}【{_("候選區")}】{/if}
</div>
{#if $leftmode=='input' && value.trim()=='' }
<SearchHelp/>
<Endmarker/>
{:else}


<div class="bodytext">
<Excerpt {goLine}/>
</div>
<!--
<div class="bodytext">
{#each scopes as scope,idx}
<span aria-hidden="true" class="scopebtn" on:click={()=>setScope(idx*2)} class:selected={idx*2==selected}>{_(scope.caption)}</span><span aria-hidden="true" class="hitbtn" on:click={()=>setScope(idx*2+1)} class:selected={1+idx*2==selected}>{scope.count}</span>
{/each}
</div>
<div class="pager">
<Pager caption={rangecaption} count={pagecount} bind:now onselect={gopage} let:idx let:caption let:active>
    <span aria-hidden="true" on:click={()=>gopage(idx)} class="clickable" class:selected={active}>{_(caption)}</span>
</Pager>
</div>

{#each excerpts as excerpt,idx}
<div class="excerptline" class:oddline={idx%2==0}>
<span aria-hidden="true" class="excerptseq clickable" class:selected={selecteditem==idx} on:click={()=>go(idx+(now*ITEMPERPAGE))}>{idx+(now*ITEMPERPAGE)+1}
{_(excerpt.puretext)}</span></div>
{/each}

{#each chunkhits as chit,idx}
<div class="excerptline" class:oddline={idx%2==0}>
<span aria-hidden="true" class="excerptseq clickable" class:selected={selecteditem==idx} on:click={()=>gock(idx)}>{idx+(now*ITEMPERPAGE)+1}
{_(chit.ck.bk?.caption)}/{_(chit.ck.caption)}</span>
<span aria-hidden="true" on:click={()=>setChunkScope(chit.ck)} class="clickable hit">{" "+chit.hits}</span></div>
{/each}
-->
<Endmarker/>



{/if}
<style>
input{font-size:1em}
</style>