<script>
import SentenceNav from './sentencenav.svelte'
export let start,lineoff;
export let ptk
import {getParallelLines} from 'ptk/align/';

import { parseOfftext } from 'ptk/offtext';
let sourcetexts=[];
const updateTranslation=async ()=>{
    sourcetexts=await getParallelLines(ptk,start+lineoff,null,{remote:true,local:false});//different ptk only
}
const puretext=(_text)=>{
    const [text]=parseOfftext(_text);
    return text;
}
$: updateTranslation(start,lineoff);
</script>
<div class="paralleltext"> 
    <SentenceNav {ptk}/>
    {#each sourcetexts as item}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div>{puretext(item.linetext)}</div>
    <div class="hr"/>
    {/each}
</div>