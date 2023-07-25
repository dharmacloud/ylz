<script>
import {getParallelLines} from 'ptk/align/';
import {activepb,activefolioid,activePtk,tapmark,folioChars,folioLines} from './store.js'
import { parseOfftext,folioPosFromChunkLine, bsearchNumber} from 'ptk';

import SentenceNav from './sentencenav.svelte'
import { loadFolio } from './nav.js';
export let closePopup=function(){};
export let address;
export let ptk;
$: [start,end, _from,_till ,lineoff]=ptk.rangeOfAddress(address);

let translations=[];
const getBookTitle=(ptk,nbk)=>{
    const bk=ptk.defines.bk;
    const line=bk.linepos[nbk]; //assuming folio tag at bk
    const folio=ptk.defines.folio;
    
    const at=bsearchNumber(folio.linepos, line+1)-1;
    if (folio.linepos[at]!==line) {
        return bk.innertext.get(nbk);
    } else {
        return ~at?folio.innertext.get(at):bk.innertext.get(nbk);
    }
}

const marktap=(pb,line)=>{
    // const pos=folioPosFromChunkLine(,pb,line)
    // tapmark.set(pos);
}
const goFolioByLine=(ptk,line)=>{
    const pb=ptk.defines.pb;
    const folio=ptk.defines.folio;
    if (!pb) return ;
    const pbat=ptk.nearestTag(line,'pb')-1;
    const folioat=ptk.nearestTag(line,'folio')-1;
    const pbid=pb.fields.id.values[pbat];
    const newfolio=folio.fields.id.values[folioat];
    loadFolio(newfolio,()=>{
        activePtk.set(ptk.name);
        activepb.set( (parseInt(pbid)||1)-1);
        marktap(pbid,line);
    }) 
    closePopup();
}
const hasfolio=(ptk,line)=>{
    const folioat=ptk.nearestTag(line+1,'folio');
    return folioat>-1;
}
const puretext=(_text)=>{
    const [text]=parseOfftext(_text);
    return text;
}

const updateTranslation=async (address)=>{
    translations=await getParallelLines(ptk,start+lineoff,null,{local:true,remote:false});//same ptk only
}
$: updateTranslation(address);
</script>
<div class="paralleltext">
<SentenceNav {ptk} bind:address/>
<div class="hr"/>
{#each translations as item}
<!-- svelte-ignore a11y-click-events-have-key-events -->
{#if !~item.heading?.bkid?.indexOf('_variorum')}
<div class:selecteditem={item.heading?.bkid==$activefolioid}>
<span  on:click={()=>goFolioByLine(item.ptk,item.line)} class="clickable author">{getBookTitle(item.ptk,item.heading?.bk?.at)}{hasfolio(item.ptk)?'←':' '}</span>{puretext(item.linetext)}</div>
{/if}
<div class="hr"/>
{/each}
<SentenceNav {ptk} bind:address/>
<div class="endmarker">※※※</div>
</div>

