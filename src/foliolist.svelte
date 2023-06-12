<script>
export let ptk;
import {activebook,activebookid, activefolio} from './store.js';
export let onclose=function(){};
const getBookList=()=>{
    const folio=ptk.defines.folio;
    const bk=ptk.defines.bk;
    const out=[];
    for (let i=0;i<folio.linepos.length;i++) {
        const id=folio.fields.id.values[i];
        const at=bk.fields.id.values.indexOf(id);
        if (~at) {
            out.push(at);
        }
    }
    return out;
}
const books=getBookList();
const selectbook=nbk=>{
    const bk=ptk.defines.bk;
    activebook.set(nbk);
    activebookid.set(bk.fields.id.values[nbk]);
    activefolio.set(0);
    onclose();
}

const getBookName=nbk=>{
    const bk=ptk.defines.bk;
    const bookname=bk.innertext.get(nbk); 
    return bk.fields.heading.values[nbk]+'-'+bookname;
}
</script>
<div class="toctext">經錄</div>
{#each books as nbk}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="book" on:click={()=>selectbook(nbk)}><span class:selecteditem={$activebook==nbk} >{getBookName(nbk)}</span></div>
{/each}


