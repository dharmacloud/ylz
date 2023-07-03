<script>
import {getParallelLines} from 'ptk/align/';
import {activefolio,activebookid,activePtk,tapmark,folioChars,folioLines} from './store.js'
import { parseOfftext,folioPosFromLine} from 'ptk';

import SentenceNav from './sentencenav.svelte'
export let closePopup=function(){};
export let address;
export let ptk;
$: [start,end, _from,_till ,lineoff]=ptk.rangeOfAddress(address);

let translations=[];
const getBookTitle=(ptk,nbk)=>{
    const bk=ptk.defines.bk;
    const heading=bk.fields.heading.values[nbk];
    return heading;
}

const marktap=async (pb,line)=>{
    const pos=await folioPosFromLine(ptk,pb,line,$activebookid,$folioLines,$folioChars)
    tapmark.set(pos);
}
const goFolioByLine=(ptk,line)=>{
    const pb=ptk.defines.pb;
    const folio=ptk.defines.folio;
    if (!pb) return ;
    const oldbook=$activebookid;
    const pbat=ptk.nearestTag(line,'pb')-1;
    const folioat=ptk.nearestTag(line,'folio')-1;
    const pbid=pb.fields.id.values[pbat];
    const newbook=folio.fields.id.values[folioat];
    activebookid.set(newbook);
    activePtk.set(ptk.name);
    setTimeout(()=>{//wait until the file is loaded, 
        activefolio.set( parseInt(pbid)-1);
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
<div class:selecteditem={item.heading?.bkid==$activebookid}><span  on:click={()=>goFolioByLine(item.ptk,item.line)} class="clickable author">{getBookTitle(item.ptk,item.heading?.bk?.at)}{hasfolio(item.ptk)?'←':' '}</span>{puretext(item.linetext)}</div>
<div class="hr"/>
{/each}
<SentenceNav {ptk} bind:address/>
<div class="endmarker">※※※</div>
</div>

