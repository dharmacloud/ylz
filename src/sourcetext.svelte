<script>
import SentenceNav from './sentencenav.svelte'
export let ptk
import {getParallelLines} from 'ptk/align/';
import {tapmark,tapChunkLine,loadingbook} from './store.js'
import { parseOfftext } from 'ptk/offtext';

let sourcetexts=[];
const updateParallels=async (mark,loading)=>{
    if (loading) return;
    const {ptkline}=$tapChunkLine;
    sourcetexts=await getParallelLines(ptk,ptkline,null,{remote:true,local:false});//different ptk only
}
const puretext=(_text)=>{
    const [text]=parseOfftext(_text);
    return text;
}
$: updateParallels($tapmark,$loadingbook);
</script>

<div class="paralleltext"> 
    <SentenceNav {ptk}/>
    {#each sourcetexts as item}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div>{puretext(item.linetext)}</div>
    <div class="hr"/>
    {/each}
</div>