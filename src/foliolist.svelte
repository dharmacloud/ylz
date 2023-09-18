<script>
import Favoritebuttons from './favoritebuttons.svelte';
import { loadFolio } from './nav.js';
import {downloadToCache} from 'ptk/platform/downloader.js'
import {CacheName} from './constant.js'
export let thetab;
import {activefolioid, tosim,parallelFolios,stopAudio,folioincache,online,activepb} from './store.js';
import Endmarker from './endmarker.svelte';
import {ptkInCache} from './folio.js'
import {_} from './textout.ts'
import { usePtk,openPtk } from 'ptk';
export let closePopup=function(){};
let aptk="ylz-c",downloadmessage='';
let folios=[];
const texttypeOf=prefix=>{
    if (prefix.slice(0,3)=='agm'||prefix=='lastword') return 1; //聲聞經
    if (prefix.slice(0,5)=='vnybs') return 4; //大乘律
    if (prefix.slice(0,3)=='vny') return 3; //聲聞律
    return 2;//大乘經
}
const openptk=async name=>{
    const res=await downloadToCache(CacheName,name+'.ptk',msg=>{
        downloadmessage=name+'.ptk '+msg;
    })
    const buf=await res.arrayBuffer();
    const ptk=await openPtk(name,new Uint8Array(buf));
    return ptk;
}
const getFolioList=async ()=>{
    const cachedPtks=await ptkInCache();
    const at=cachedPtks.indexOf(aptk);
    if (!~at) {
        folios=[];
        return;
    }

    const ptk=await openptk(aptk);
    const folio=ptk.defines.folio;
    const out=[];
    for (let i=0;i<folio.linepos.length;i++) {
        const id=folio.fields.id.values[i];
        const endingnumber=id.match(/(\d+)$/);
        const at=id.indexOf('_');
        const bkprefix=~at?id.slice(0,at):id;
        if (!~at && (!endingnumber||endingnumber[1]=='1') ) {//only show book without _ and not ends with >2
            //const tt=texttypeOf(bkprefix);
            //if (texttype&& tt!==texttype) continue;
            out.push([i, id, parallelFolios(ptk,id)]);
        }
    }
    folios=out;
}
const selectfolio=nfolio=>{
    const folio=usePtk(aptk).defines.folio;
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
    const folio=usePtk(aptk).defines.folio;
    return _(folio.innertext.get(nfolio),$tosim); 
}
const getFolioId=nfolio=>{
    const folio=usePtk(aptk).defines.folio;
    return folio.fields.id.values[nfolio]
}
const samesutra=(f1,f2)=>{
    return f1.replace(/\d+$/,'')==f2.replace(/\d+$/,'')
}
let opening=false;
const installptk=async name=>{
    if (opening)return;
    opening=true;
    downloadmessage='try to download '+name+'.ptk'
    await openptk(name);
    opening=false;
    downloadmessage='';
    getFolioList(aptk);
    return ptk;
}


$: getFolioList(aptk);

</script>
<div class="tabs">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <span  class="clickable" class:selected={aptk=="ylz-c"}  on:click={()=>aptk="ylz-c"}>常用</span>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <span  class="clickable" class:selected={aptk=="ylz-m"}  on:click={()=>aptk="ylz-m"}>{_("大乘",$tosim)}</span>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <span class="clickable" class:selected={aptk=="ylz-svk"}  on:click={()=>aptk="ylz-svk"}>{_("聲聞",$tosim)}</span>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <span  class="clickable" class:selected={aptk=="ylz-vny"}  on:click={()=>aptk="ylz-vny"}>{_("戒律",$tosim)}</span>

</div>
{#if folios.length}
{#each folios as [nfolio,folioid,pars]}
<div class="book">
{#key $tosim}
 <!-- svelte-ignore a11y-click-events-have-key-events -->
<span class:dimmed={!$folioincache[folioid]} on:click={()=>selectfolio(nfolio)} 
    class:selecteditem={samesutra($activefolioid,folioid)} >{getFolioName(nfolio)}</span>

<Favoritebuttons ptk={usePtk(aptk)} {folioid} {closePopup}/>
{#each pars as par}
<!-- svelte-ignore a11y-click-events-have-key-events -->
{#if $folioincache[getFolioId(par)] || $online}
<span class="parallelfolio" on:click={()=>selectfolio(par)} 
    class:dimmed={!$folioincache[getFolioId(par)]}
    class:selecteditem={$activefolioid==getFolioId(par)} >
{getFolioName(par)}</span>
<Favoritebuttons folioid={getFolioId(par)} ptk={usePtk(aptk)} {closePopup} />
{/if}

{/each}
{/key}
</div>
{/each}

{:else}
<div class="bodytext">
<!-- svelte-ignore a11y-click-events-have-key-events -->
<span class="clickable hyperlink" on:click={()=>installptk(aptk)}>安裝 {downloadmessage}</span>
{#if aptk=="ylz-vny"}
<br/>{_("在家居士閱讀聲聞戒律應有充份理由。")}
{/if}
</div>
{/if}
<div class="bodytext">
<Endmarker/>
</div>