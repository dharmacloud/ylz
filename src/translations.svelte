<script>
import {getParallelLines} from 'ptk/align/';
import {activefolio,activebook,activebookid} from './store.js'
import { parseOfftext } from 'ptk/offtext';
export let closePopup=function(){};
export let address;
export let ptk;
const [start,end,line]=ptk.rangeOfAddress(address);

const out=[];
const getBookTitle=(ptk,nbk)=>{
    const bk=ptk.defines.bk;
    const heading=bk.fields.heading.values[nbk];
    return heading;
}
const goFolio=(ptk,line)=>{
    const pb=ptk.defines.pb;
    const bk=ptk.defines.bk;
    const folio=ptk.defines.folio;

    const pbat=ptk.nearestTag(line+1,'pb')-1;
    const bkat=ptk.nearestTag(line+1,'bk')-1;
    const folioat=ptk.nearestTag(line+1,'folio')-1;
    const pbid=pb.fields.id.values[pbat];

    activebook.set(bkat)

    activebookid.set(folio.fields.id.values[folioat]);
    activefolio.set( parseInt(pbid)-1);
    
    closePopup();
}
const puretext=(_text)=>{
    const [text]=parseOfftext(_text);
    return text;
}
</script>
<div class="paralleltext">
{#await getParallelLines(ptk,start+line,out)}
{:then}
{#each out as item}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class:selecteditem={item.heading?.bk?.at==$activebook}><span  on:click={()=>goFolio(item.ptk,item.line)} class="clickable author">{getBookTitle(item.ptk,item.heading?.bk?.at)}←</span>{puretext(item.linetext)}</div>
<div class="hr"/>
{/each}
<div>--</div>
{/await}
</div>

