<script>
export let ptk;
import {activebookid, activefolio, stopVideo} from './store.js';
export let closePopup=function(){};

const getBookList=()=>{
    const folio=ptk.defines.folio;
    const bk=ptk.defines.bk;
    const out=[];
    for (let i=0;i<folio.linepos.length;i++) {
        const id=folio.fields.id.values[i];
        const at=bk.fields.id.values.indexOf(id);
        if (~at && !bk.fields.hidden?.values[at]) {
            out.push([at, id]);
        }
    }
    return out;
}
const books=getBookList();
const selectbook=nbk=>{
    const bk=ptk.defines.bk;
    stopVideo();
    activebookid.set(bk.fields.id.values[nbk]);
    activefolio.set(0);    
    closePopup();
}

const getBookName=nbk=>{
    const bk=ptk.defines.bk;
    const bookname=bk.innertext.get(nbk); 
    return bk.fields.heading.values[nbk]||bookname;
}
</script>
{#each books as [nbk,bkid]}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="book" on:click={()=>selectbook(nbk)}><span class:selecteditem={$activebookid==bkid} >{getBookName(nbk)}</span></div>
{/each}


