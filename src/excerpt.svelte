<script>
import {usePtk,listExcerpts,MAXPHRASELEN} from 'ptk'
import {activePtk,tofind,reverseswipe} from './store.js'
import {makeAddressFromLine,humanAddress} from './address.js'
import ExcerptLine from './excerptline.svelte'
import Pager from './comps/pager.svelte';
import {_} from './textout.js'
import Swipeview from 'offtextview/comps/swipeview.svelte';

export let goLine;
const ITEMPERPAGE=5;
$: ptk=usePtk($activePtk);
// $: includelines=includesent>-1&&ptk?ptk?.columns.sent?.occur[includesent]:null
// $: excludelines=excludesent>-1&&ptk?ptk.columns.sent?.occur[excludesent]:null;

let allexcerpts=[],excerpts=[], allpostings=[],allchunkhits=[],chunkhits=[],allphrases=[],now=0,scopes=[];
let pagecount=0,selected=0,selecteditem=-1;
let rangecaption='';
// add 本卷(本經)
const setScope=async (idx,range)=>{
    const at=Math.floor(idx/2);
    pagecount=0;
    if (!scopes[at]?.count) return;
    selected=idx;
    if (!range) {
        rangecaption='';
    }
    const {lines,chunks,phrases,postings}=await listExcerpts(ptk,$tofind, 
    {range:range||scopes[at].scope});
    allphrases=phrases;
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
            toload.push(allexcerpts[i]);
        }
        await ptk.loadLines(toload.map(it=>it[0]));
        for (let i=0;i<toload.length;i++) {
            const [line,occur]=toload[i];
            const linetext=ptk.getLine(line);
            const hits =occur.map(n=>Math.floor(n/MAXPHRASELEN));
		    const phraselength =occur.map(n=>n%MAXPHRASELEN);
            excerpts.push({linetext,line,hits,phraselength});
        }
        pagecount=Math.floor(allexcerpts.length /ITEMPERPAGE)+1;
    }
    excerpts=excerpts;
    chunkhits=chunkhits;
    now=idx;
}
const setChunkScope=(ck)=>{
    const rangeaddr='bk#'+ck.bk.id+'.ck#'+ck.id;
    rangecaption=(ck.bk?.caption||'')+'/'+ck.caption;
    setScope(selected*2+1,rangeaddr);
}

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

const gochar=(line,choff)=>{
    goLine(line,choff);
}

const updateList=(tf)=>{
    ptk.scanText(tf).then(res=>{
        scopes=res;
        let done=false;
        for (let i=0;i<scopes.length;i++) { //first no-null scope
            if (scopes[i].count) {
                setScope(i*2+1);
                done=true;
                break;
            }
        }
        if (!done) {//no match
            allexcerpts=[];
            allpostings=[];
            gopage(0);
        }
    });
}
const onSwipe=direction=>{
    const pages=excerpts.length?excerpts:chunkhits;
    now+=direction;
    if (now<0) now=0;
    if (now>=pages.length-1) now=pages.length-1;
    gopage(now);
}


$: updateList($tofind,$activePtk)

</script>
<div class="bodytextarea">
{#each scopes as scope,idx}
<span aria-hidden="true" class="clickable scopebtn" on:click={()=>setScope(idx*2)} class:selected={idx*2==selected}>
    {_(scope.caption)}</span><span aria-hidden="true" class="clickable hitbtn" on:click={()=>setScope(idx*2+1)} 
        class:selected={1+idx*2==selected}>{'('+scope.count+')'}</span>
{/each}

<div class="pager">
<Pager caption={rangecaption} count={pagecount} bind:now onselect={gopage} let:idx let:caption let:active>
    <span aria-hidden="true" on:click={()=>gopage(idx)} class="clickable" class:selected={active}>{_(caption)}</span>
</Pager>
</div>

<Swipeview {onSwipe} reverse={$reverseswipe=='1'}>
{#each excerpts as excerpt,idx}
<div class="excerptline" class:oddline={idx%2==0}>
<span class="excerptseq" >{idx+(now*ITEMPERPAGE)+1}</span><ExcerptLine {gochar} {...excerpt}/>
<span class:selected={selecteditem==idx+(now*ITEMPERPAGE)} class="clickable ck" aria-hidden="true" on:click={()=>go(idx+(now*ITEMPERPAGE))}>{humanAddress(makeAddressFromLine(excerpt.line))}</span>
</div>
{/each}
</Swipeview>

<Swipeview {onSwipe} reverse={$reverseswipe=='1'}>
{#each chunkhits as chit,idx}
<div class="excerptline" class:oddline={idx%2==0}>
<span aria-hidden="true" class="excerptseq clickable" 
class:selected={selecteditem==idx} on:click={()=>gock(idx)}>{idx+(now*ITEMPERPAGE)+1}
{_(chit.ck.bk?.caption)}/{_(chit.ck.caption)}</span>
<span aria-hidden="true" on:click={()=>setChunkScope(chit.ck)} class="clickable hit">{" "+chit.hits}</span></div>
{/each}
</Swipeview>
</div>