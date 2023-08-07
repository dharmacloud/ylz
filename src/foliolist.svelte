<script>
import Favoritebuttons from './favoritebuttons.svelte';
import { loadFolio } from './nav.js';
import {offlinable} from './icons.js'
export let ptk,thetab;
import {activefolioid, parallelFolios,stopAudio,folioincache,online} from './store.js';
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
    const folioid=folio.fields.id.values[nfolio];
    if ($folioincache[folioid] || $online) {
        stopAudio();
        loadFolio(folioid,function(){
            thetab='toc';
        });
        closePopup();
    }
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
<div class="toctext">開啟過的經典可離線閱讀</div>
{#each folios as [nfolio,folioid,pars]}
<div class="book">
 <!-- svelte-ignore a11y-click-events-have-key-events -->
<span class:dimmed={!$folioincache[folioid] && !$online} on:click={()=>selectfolio(nfolio)} class:selecteditem={$activefolioid==folioid} >{getFolioName(nfolio)}</span>
{#if $online && $folioincache[folioid]}<span>{@html offlinable}</span>{/if}
<Favoritebuttons {ptk} {folioid} {closePopup}/>
{#each pars as par}
<!-- svelte-ignore a11y-click-events-have-key-events -->
{#if $folioincache[par] || $online}
<span class="parallelfolio" on:click={()=>selectfolio(par)} class:selecteditem={$activefolioid==getFolioId(par)} >
{getFolioName(par)}</span>
<Favoritebuttons folioid={par} {ptk} {closePopup} />
{/if}
{/each}
</div>
{/each}


