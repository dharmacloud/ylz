<script>
import SentenceNav from './sentencenav.svelte'
export let ptk
import {getParallelLines} from 'ptk/align/';
import {tapmark,tapChunkLine} from './store.js'
import { parseOfftext } from 'ptk/offtext';
let sourcetexts=[];
const updateParallels=async ()=>{
    const {ptkline}=$tapChunkLine;
    sourcetexts=await getParallelLines(ptk,ptkline,null,{remote:true,local:false});//different ptk only
}
const puretext=(_text)=>{
    const [text]=parseOfftext(_text);
    return text;
}
$: updateParallels($tapmark);
</script>
<div class="paralleltext"> 
    <SentenceNav {ptk}/>
    {#each sourcetexts as item}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div>{puretext(item.linetext)}</div>
    <div class="hr"/>
    {/each}
</div>