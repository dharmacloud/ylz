<script>
export let ptk ;
import Slider from './3rd/rangeslider.svelte';
import {tapmark,foliotext,loadingfolio,tapAddress} from  './store.js'
import {updateUrl} from './urlhash.js'
import {get} from 'svelte/store'
import {debounce} from 'ptk'
import ChunkNav from './chunknav.svelte'
import {goPb} from './nav.js'
let ck,loff,displayline=0,
alllines=[], lines=[],sutra=[0,0],sutras=[],minsutra=0,maxsutra=0;
$: activeline=0;
const loadChunkText=(mark,loading)=>{
    if (loading) return;
    const ft=get(foliotext);
    if (!ft||!ft.fromFolioPos) return;
    const {ckid,lineoff}=ft.fromFolioPos(mark);
    loff=lineoff;
    sutras.length=0;
    alllines=[];
    displayline=0;
    
    alllines=ft.chunkText(ckid).split('\n');
    minsutra=0,maxsutra=0;
    for (let i=0;i<alllines.length;i++) {
        const m=alllines[i].match(/\^n(\d+)/);
        if (m) {
            const n=parseInt(m[1]);
            if (minsutra==0 && n) {
                minsutra=n;
            }
            maxsutra=n;
            sutras.push(i);
        }
    }
    updateText()
    if (ck==ckid) {
        idx=sutra[0];
        lines=alllines.slice( sutras[idx], sutras[idx+1]);
        displayline=sutras[idx]||0;
    } else {
        sutra[0]=0; //select first sutra of this chunk
        displayline=sutras[0]||0;
        activeline=0;
    }
    ck=ckid;
}
const updateText=()=>{
    if (sutras.length) {
        sutras.push(alllines.length-1);//has sutra
        lines=alllines.slice( sutras[0], sutras[1]);
    } else {
        lines=alllines;
    }
}

$: loadChunkText($tapmark,$loadingfolio);

const renderLine=line=>{
    return line.replace(/\^[a-z]#?[a-z\d]*/g,'');
}
const setAddress=(lineoff)=>{
    const ft=get(foliotext);
    if (!ft||!ft.fromFolioPos) return;
    const [pbid,line,ch]=ft.toFolioPos(ck,lineoff) ;
    goPb(pbid,ck,line);
    tapmark.set([pbid,line,ch]);
    activeline=lineoff-displayline;
    updateUrl(tapAddress());
}
const goactiveline=()=>{
    const ele=document.querySelector('.toctext .activeline');
    if (!ele) return;
    ele.parentElement.parentElement.parentElement.scrollTop=ele.offsetTop;
}
const gotop=()=>{
    const ele=document.querySelector('.toctext .activeline');
    if (!ele) return;
    ele.parentElement.parentElement.parentElement.scrollTop=0;
}
const setSutra=e=>{
    const idx=e.detail[0];
    lines=alllines.slice( sutras[idx], sutras[idx+1]);
    displayline=sutras[idx];
    activeline=0;
}
</script>

<div class="toctext">
<!-- svelte-ignore a11y-click-events-have-key-events -->

<span class="clickable gotop" on:click={gotop}>↑</span>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<span class="clickable goactiveline" on:click={goactiveline}>▃</span>
<ChunkNav {ptk}/>

{#if sutras.length}
<Slider bind:value={sutra} on:input={debounce(setSutra,100)} max={sutras.length-2} min={0} >
    <span slot="caption" style="float:right">經{(minsutra+sutra[0]||0)}/{maxsutra}</span></Slider>
{/if}
<hr/>
{#key activeline}
{#each lines as line,idx}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div on:click={()=>setAddress(displayline+idx)} class:activeline={activeline==idx}>{@html renderLine(line)}</div>
{/each}
{/key}
<div class="endmarker">※※※</div>
</div>
