<script>
export let start,ptk;
import {getParallelLines} from 'ptk/align/';
import SentenceNav from './sentencenav.svelte'
import { parseOfftext } from 'ptk/offtext';
$: [start,end, _from,_till ,lineoff]=ptk.rangeOfAddress(address);
let sourcetexts=[];

export let closePopup=function(){};
export let address;
const updateTranslation=async (address)=>{
    sourcetexts=await getParallelLines(ptk,start+lineoff,null,{remote:true,local:false});//different ptk only
}
const puretext=(_text)=>{
    const [text]=parseOfftext(_text);
    return text;
}
$: updateTranslation(address);
</script>
<div class="paralleltext"> 
    <SentenceNav {ptk} bind:address/>
    {#each sourcetexts as item}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div>{puretext(item.linetext)}</div>
    <div class="hr"/>
    {/each}
</div>
