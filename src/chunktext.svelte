<script>
export let ptk ;
import {tapmark,foliotext,loadingbook} from  './store.js'
import {get} from 'svelte/store'
import ChunkNav from './chunknav.svelte'
import {goPb} from './nav.js'
let ck,loff,lines=[];

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
$: loadChunkText($tapmark,$loadingbook);

const renderLine=line=>{
    return line.replace(/\^[a-z]#?[a-z\d]*/g,'');
}
const setAddress=(lineoff)=>{
    const ft=get(foliotext);
    if (!ft||!ft.fromFolioPos) return;
    const [pbid,line,ch]=ft.toFolioPos(ck,lineoff) ;
    goPb(pbid,ck,line);
    tapmark.set([pbid,line,ch]);
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
<span class="gotop" on:click={gotop}>⮅</span>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<span class="goactiveline" on:click={goactiveline}>▃</span>
<ChunkNav {ptk}/>
{#each lines as line,idx}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div on:click={()=>setAddress(idx)} class:activeline={loff==idx}>{@html renderLine(line)}</div>
{/each}
</div>

<style>
.gotop {z-index:999;position:fixed;right:1em;top:1em;color:var(--selected-color)}
.goactiveline {z-index:999;position:fixed;right:1em;color:var(--selected-color)}
</style>