<script>
import SentenceNav from './sentencenav.svelte'
export let ptk
import {getParallelLines} from 'ptk/align/';
import {tapmark,foliotext,loadingfolio} from './store.js'
import { parseOfftext } from 'ptk/offtext';
import {_} from './textout.ts'
    import Endmarker from './endmarker.svelte';
let sourcetexts=[];
const updateParallels=async (mark,loading)=>{
    if (loading) return;
    const cl=$foliotext?.fromFolioPos($tapmark);
    if (!cl) return ;
    sourcetexts=await getParallelLines(ptk,cl.ptkline,null,{remote:true,local:false});//different ptk only
}
const puretext=(_text)=>{
    const [text]=parseOfftext(_text);
    return text;
}
$: updateParallels($tapmark,$loadingfolio);
</script>

<div class="bodytext"> 
    <SentenceNav {ptk}/>
    {#each sourcetexts as item}
    <div>{_(puretext(item.linetext))}</div>
    <div class="hr"/>
    {/each}
    <Endmarker/>
</div>

