<script>
import Favoritebuttons from './favoritebuttons.svelte';
import { loadFolio } from './nav.js';
export let ptk,thetab;
import {activefolioid, tosim,parallelFolios,stopAudio,folioincache,online, activepb} from './store.js';
import Endmarker from './endmarker.svelte';
import {_} from './textout.ts'
export let closePopup=function(){};
let texttype=0;
const texttypeOf=prefix=>{
    if (prefix.slice(0,3)=='agm'||prefix=='lastword') return 1; //聲聞經
    if (prefix.slice(0,5)=='vnybs') return 4; //大乘律
    if (prefix.slice(0,3)=='vny') return 3; //聲聞律
    return 2;//大乘經
}
const getFolioList=(texttype=0)=>{
    const folio=ptk.defines.folio;
    const out=[];
    for (let i=0;i<folio.linepos.length;i++) {
        const id=folio.fields.id.values[i];
        const endingnumber=id.match(/(\d+)$/);
        const at=id.indexOf('_');
        const bkprefix=~at?id.slice(0,at):id;
        if (!~at && (!endingnumber||endingnumber[1]=='1') ) {//only show book without _ and not ends with >2
            const tt=texttypeOf(bkprefix);
            if (texttype&& tt!==texttype) continue;
            out.push([i, id, parallelFolios(ptk,id)]);
        }
    }
    return out;
}
const selectfolio=nfolio=>{
    const folio=ptk.defines.folio;
    const folioid=folio.fields.id.values[nfolio];
    if ($folioincache[folioid] || $online) {
        stopAudio();
        loadFolio(folioid,function(){
            thetab='toc';
            activepb.set('1');
        });
        closePopup();
    }
}

const getFolioName=nfolio=>{
    const folio=ptk.defines.folio;
    return _(folio.innertext.get(nfolio),$tosim); 
}
const getFolioId=nfolio=>{
    const folio=ptk.defines.folio;
    return folio.fields.id.values[nfolio]
}
const samesutra=(f1,f2)=>{
    return f1.replace(/\d+$/,'')==f2.replace(/\d+$/,'')
}
$: folios=getFolioList(texttype);

</script>
<div class="tabs">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <span class="clickable" class:selected={texttype==1}  on:click={()=>texttype=texttype==1?0:1}>{_("聲聞經",$tosim)}</span>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <span  class="clickable" class:selected={texttype==3}  on:click={()=>texttype=texttype==3?0:3}>{_("聲聞律",$tosim)}</span>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <span  class="clickable" class:selected={texttype==2}  on:click={()=>texttype=texttype==2?0:2}>{_("大乘經",$tosim)}</span>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <span  class="clickable" class:selected={texttype==4}  on:click={()=>texttype=texttype==4?0:4}>大乘律</span>
</div>
    
{#each folios as [nfolio,folioid,pars]}
<div class="book">
{#key $tosim}
 <!-- svelte-ignore a11y-click-events-have-key-events -->
<span class:dimmed={!$folioincache[folioid]} on:click={()=>selectfolio(nfolio)} 
    class:selecteditem={samesutra($activefolioid,folioid)} >{getFolioName(nfolio)}</span>

<Favoritebuttons {ptk} {folioid} {closePopup}/>
{#each pars as par}
<!-- svelte-ignore a11y-click-events-have-key-events -->
{#if $folioincache[getFolioId(par)] || $online}
<span class="parallelfolio" on:click={()=>selectfolio(par)} 
    class:dimmed={!$folioincache[getFolioId(par)]}
    class:selecteditem={$activefolioid==getFolioId(par)} >
{getFolioName(par)}</span>
<Favoritebuttons folioid={getFolioId(par)} {ptk} {closePopup} />
{/if}

{/each}
{/key}
</div>
{/each}
<div class="bodytext">
<Endmarker/>
</div>