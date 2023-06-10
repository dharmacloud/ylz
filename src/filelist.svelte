<script>
export let ptk;
import {activebook,activebookid} from './store.js';
export let onclose=function(){};
const getBookList=()=>{
    const bk=ptk.defines.bk;
    const out=[];
    for (let i=0;i<bk.linepos.length;i++) {
        const id=bk.fields.id.values[i];
        if (~id.indexOf("_")) {
            out.push(i);
        }
    }
    return out;
}
const books=getBookList();
const selectbook=nbk=>{
    const bk=ptk.defines.bk;
    activebook.set(nbk);
    activebookid.set(ptk.defines.bk.fields.id.values[nbk]);
    onclose();
}

const getBookName=nbk=>{
    const bk=ptk.defines.bk;
    const bookname=bk.innertext.get(nbk); 
    return bookname + '('+ bk.fields.heading.values[nbk]+')';
}
</script>

{#each books as nbk}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="book" on:click={()=>selectbook(nbk)}>{getBookName(nbk)}</div>
{/each}
