<script>
import {getParallelLines} from 'ptk/align/';
import {activepb,activefolioid,activePtk,tapmark,folioChars,folioLines} from './store.js'
import { parseOfftext,folioPosFromLine, bsearchNumber} from 'ptk';

import SentenceNav from './sentencenav.svelte'
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

const marktap=async (pb,line)=>{
    const pos=await folioPosFromLine(ptk,pb,line,$activefolioid,folioLines(),$folioChars)
    tapmark.set(pos);
}
const goFolioByLine=(ptk,line)=>{
    const pb=ptk.defines.pb;
    const folio=ptk.defines.folio;
    if (!pb) return ;
    const oldbook=$activefolioid;
    const pbat=ptk.nearestTag(line,'pb')-1;
    const folioat=ptk.nearestTag(line,'folio')-1;
    const pbid=pb.fields.id.values[pbat];
    const newbook=folio.fields.id.values[folioat];
    activefolioid.set(newbook);
    activePtk.set(ptk.name);
    setTimeout(()=>{//wait until the file is loaded, 
        activepb.set( parseInt(pbid)-1);
        marktap(pbid,line);
    }, oldbook==newbook?10:3000);//not working on slow network
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
{#if !~item.heading.bkid.indexOf('_variorum')}
<div class:selecteditem={item.heading?.bkid==$activefolioid}>
<span  on:click={()=>goFolioByLine(item.ptk,item.line)} class="clickable author">{getBookTitle(item.ptk,item.heading?.bk?.at)}{hasfolio(item.ptk)?'←':' '}</span>{puretext(item.linetext)}</div>
{/if}
<div class="hr"/>
{/each}
<SentenceNav {ptk} bind:address/>
<div class="endmarker">※※※</div>
</div>

