<script>
import Favoritebuttons from './favoritebuttons.svelte';
import { loadFolio } from './nav.js';
export let ptk;
import {activefolioid, parallelFolios,activepb, stopVideo} from './store.js';
export let closePopup=function(){};

const getFolioList=()=>{
    const folio=ptk.defines.folio;
    const out=[];
    for (let i=0;i<folio.linepos.length;i++) {
        const id=folio.fields.id.values[i];
        const endingnumber=id.match(/(\d+)$/);
        if (!~id.indexOf('_') && (!endingnumber||endingnumber[1]=='1') ) {//only show book without _ and not ends with >2
            out.push([i, id, parallelFolios(ptk,id)]);
        }
    }
    return out;
}

const folios=getFolioList();
const selectfolio=nfolio=>{
    const folio=ptk.defines.folio;
    stopVideo();
    const folioid=folio.fields.id.values[nfolio];
    loadFolio(folioid);
    closePopup();
}

const getFolioName=nfolio=>{
    const folio=ptk.defines.folio;
    return folio.innertext.get(nfolio); 
}
const getFolioId=nfolio=>{
    const folio=ptk.defines.folio;
    return folio.fields.id.values[nfolio]
}
</script>
{#each folios as [nfolio,folioid,pars]}
<div class="book">
<!-- svelte-ignore a11y-click-events-have-key-events -->
<span on:click={()=>selectfolio(nfolio)} class:selecteditem={$activefolioid==folioid} >{getFolioName(nfolio)}</span>
<Favoritebuttons {folioid} {closePopup}/>
{#each pars as par}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<span class="parallelfolio" on:click={()=>selectfolio(par)} class:selecteditem={$activefolioid==getFolioId(par)} >
{getFolioName(par)}</span>
<Favoritebuttons folioid={par} {closePopup} />
{/each}
</div>
{/each}


