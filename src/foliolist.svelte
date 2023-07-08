<script>
export let ptk;
import {activebookid, activefolio, stopVideo,nanzangbooks} from './store.js';
export let closePopup=function(){};

const parallelBooks=(bkid)=>{
    const bk=ptk.defines.bk;
    const at=bkid.indexOf('_');
    const prefix=~at?bkid.slice(0,at ):bkid;
    const out=[],idarr=bk.fields.id.values;
    for (let i=0;i<idarr.length;i++) {
        if (idarr[i].startsWith(prefix+'_') && idarr[i]!==bkid) {
            out.push(i)
        }
    }
    return out;
}
const getBookList=()=>{
    const folio=ptk.defines.folio;
    const bk=ptk.defines.bk;
    const out=[];
    for (let i=0;i<folio.linepos.length;i++) {
        const id=folio.fields.id.values[i];
        const at=bk.fields.id.values.indexOf(id);
        if (~at && !bk.fields.hidden?.values[at]) {
            out.push([at, id, parallelBooks(id)]);
        }
    }
    return out;
}
const books=getBookList();
const selectbook=nbk=>{
    const bk=ptk.defines.bk;
    stopVideo();
    const bkid=bk.fields.id.values[nbk];
    activebookid.set(bkid);
    activefolio.set(0);    
    closePopup();
}

const getBookName=nbk=>{
    const bk=ptk.defines.bk;
    const bookname=bk.innertext.get(nbk); 
    return bk.fields.heading.values[nbk]||bookname;
}
const getBookId=nbk=>{
    const bk=ptk.defines.bk;
    return bk.fields.id.values[nbk]
}
</script>
{#each books as [nbk,bkid,pars]}
<div class="book">
<!-- svelte-ignore a11y-click-events-have-key-events -->
<span on:click={()=>selectbook(nbk)} class:selecteditem={$activebookid==bkid} >{getBookName(nbk)}</span>
{#each pars as par}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<span class="parallelbook" on:click={()=>selectbook(par)} class:selecteditem={$activebookid==getBookId(par)} >
{getBookName(par)}
</span>
{/each}
</div>
{/each}


