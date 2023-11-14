<script>
import {getParallelLines} from 'ptk/align/';
import {activepb,activefolioid,activePtk,foliotext,tapmark,loadingfolio} from './store.js'
import { parseOfftext, bsearchNumber} from 'ptk';
import SentenceNav from './sentencenav.svelte'
import { loadFolio } from './nav.js';
import {_} from './textout.ts'
import Endmarker from './endmarker.svelte';
export let closePopup=function(){};
export let ptk;
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


const goFolioByLine=(ptk,line)=>{
    const pb=ptk.defines.pb;
    const folio=ptk.defines.folio;
    if (!pb) return ;
    const pbat=ptk.nearestTag(line,'pb');
    const folioat=ptk.nearestTag(line,'folio');
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

const updateTranslation=async (mark,loading)=>{
    if (loading) return [];
    const cl=$foliotext?.fromFolioPos(mark);    
    if (!cl) return;
    
    translations=await getParallelLines(ptk,cl.ptkline,null,{local:true,remote:false});//same ptk only

}
$: updateTranslation($tapmark,$loadingfolio);
</script>
<div class="bodytext">
<SentenceNav {ptk}/>
<div class="hr"/>
{#each translations as item}
{#if !~item.heading?.bkid?.indexOf('_variorum')}
<div class:selecteditem={item.heading?.bkid==$activefolioid}>
<span aria-hidden="true"  on:click={()=>goFolioByLine(item.ptk,item.line)} 
    class="clickable author">{_(getBookTitle(item.ptk,item.heading?.bk?.at))}
    {hasfolio(item.ptk)?'←':' '}</span>{_(puretext(item.linetext))}</div>
{/if}
<div class="hr"/>
{/each}
<Endmarker/>
</div>

