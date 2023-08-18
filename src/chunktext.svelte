<script>
export let ptk ;
import {tapmark,foliotext,loadingfolio,tapAddress} from  './store.js'
import {updateUrl} from './urlhash.js'
import {get} from 'svelte/store'
import ChunkNav from './chunknav.svelte'
import {goPb} from './nav.js'
let ck,loff, lines=[];
export let ptkline;
const loadChunkText=(mark,loading)=>{
    if (loading) return;
    const ft=get(foliotext);
    if (!ft||!ft.fromFolioPos) return;
    const {ckid,lineoff}=ft.fromFolioPos(mark);
    loff=lineoff;
    if (ck!==ckid) {
        lines=ft.chunkText(ckid).split('\n');
    }
    ck=ckid;
}
const loadPtkLine=async ()=>{
    const {id,bkid}=ptk.getHeading(ptkline);
    const address='bk#'+bkid+'.ck#'+id;
    const [start]=ptk.rangeOfAddress(address);
    lines=await ptk.fetchAddress(address);
    loff=ptkline-start;
    setTimeout(()=>{
        const ele=document.querySelector('.toctext .activeline');
        if (!ele) return;
        ele.parentElement.parentElement.scrollTop=ele.offsetTop-50;

    },100);
}
$: ptkline?loadPtkLine():loadChunkText($tapmark,$loadingfolio);

const renderLine=line=>{
    return line.replace(/\^[a-z]#?[a-z\d]*/g,'');
}
const setAddress=(lineoff)=>{
    if (ptkline) return;
    const ft=get(foliotext);
    if (!ft||!ft.fromFolioPos) return;
    const [pbid,line,ch]=ft.toFolioPos(ck,lineoff) ;
    goPb(pbid,ck,line);
    tapmark.set([pbid,line,ch]);
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
</script>

<div class="toctext">
<!-- svelte-ignore a11y-click-events-have-key-events -->
{#if !ptkline}
<span class="clickable gotop" on:click={gotop}>↑</span>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<span class="clickable goactiveline" on:click={goactiveline}>▃</span>
<ChunkNav {ptk}/>
{/if}

{#each lines as line,idx}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div on:click={()=>setAddress(idx)} class:activeline={loff==idx}>{@html renderLine(line)}</div>
{/each}
</div>
