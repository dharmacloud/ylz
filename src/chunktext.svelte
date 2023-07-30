<script>
export let ptk ;
import {tapmark,foliotext} from  './store.js'
import {get} from 'svelte/store'
import ChunkNav from './chunknav.svelte'
import {goPb} from './nav.js'
let ck,loff,lines=[];

const loadChunkText=(mark)=>{
    const ft=get(foliotext);
    if (!ft||!ft.fromFolioPos) return;
    const {ckid,lineoff}=ft.fromFolioPos(mark);
    loff=lineoff;
    if (ck!==ckid) {
        lines=ft.chunkText(ckid).split('\n');
    }
    ck=ckid;
}
$: loadChunkText($tapmark);

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
</script>

<div class="toctext">
<ChunkNav {ptk}/>
{#each lines as line,idx}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div on:click={()=>setAddress(idx)} class:activeline={loff==idx}>{@html renderLine(line)}</div>
{/each}
</div>
