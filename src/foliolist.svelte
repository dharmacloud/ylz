<script>
import Favoritebuttons from './favoritebuttons.svelte';
import { loadFolio } from './nav.js';
import {downloadToCache} from 'ptk/platform/downloader.js'
import {CacheName} from './constant.js'
export let thetab;
import {activefolioid, vip,tosim,parallelFolios,stopAudio,folioincache,online,activepb, activePtk} from './store.js';
import Endmarker from './endmarker.svelte';
import {ptkInCache} from './folio.js'
import {_} from './textout.js'
import { usePtk,openPtk, poolGetAll,enableAccelon23Features } from 'ptk';
import {getAllFolio} from './folio.js';
export let closePopup=function(){};
let downloadmessage='';
let folios=[];
let canceldownload=false,downloading='';
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
    enableAccelon23Features(ptk);
    return ptk;
}
const ptknameFromFolioId=()=>{
    const folioid=$activefolioid;
    let ptkname="ylz-prjn";
    const ptks=poolGetAll();
    for (let i=0;i<ptks.length;i++) {
        const folio=ptks[i].defines.folio;
        if (!folio) continue;
        if (~folio.fields.id.values.indexOf(folioid)) {
            ptkname=ptks[i].name;
        }
    }
    
    return ptkname;
}
let aptk =ptknameFromFolioId();

const getFolioList=async (aptk)=>{
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
const CancelDownloadBook=()=>{
    canceldownload=true;
}
const downloadBook=async function (folioid){
    const items=getAllFolio(usePtk(aptk) ,folioid);
    //if (items.length<2) return; 
   for (let item of items){
        const src=item+'.zip'
        console.log('downloading',src)
        await downloadToCache(CacheName,"folio/"+src,msg=>{
            downloading=src+ " "+msg;
            console.log(msg)
        });
    };
    canceldownload=false;
    downloading='';
}
const selectfolio=nfolio=>{
    const folio=usePtk(aptk).defines.folio;
    const folioid=folio.fields.id.values[nfolio];
    activePtk.set(aptk);
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
    return _(folio._innertext.get(nfolio),$tosim); 
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
    const aptk=await openptk(name);
    opening=false;
    downloadmessage='';
    getFolioList(name);
    return aptk;
}


$: getFolioList(aptk);

</script>
<div class="tabs">
    <span aria-hidden="true" class="clickable" class:selected={aptk=="ylz-prjn"}  on:click={()=>aptk="ylz-prjn"}>唯名</span>
    <span aria-hidden="true" class="clickable" class:selected={aptk=="ylz-tg"}  on:click={()=>aptk="ylz-tg"}>唯心</span>
    <span aria-hidden="true" class="clickable" class:selected={aptk=="ylz-rite"}  on:click={()=>aptk="ylz-rite"}>{_("懺儀",$tosim)}</span>
    <span aria-hidden="true" class="clickable" class:selected={aptk=="ylz-svk"}  on:click={()=>aptk="ylz-svk"}>{_("聲聞",$tosim)}</span>
    <span aria-hidden="true" class="clickable" class:selected={aptk=="ylz-vny"}  on:click={()=>aptk="ylz-vny"}>戒律</span>
</div>
{#if folios.length}
{#if downloading}
{downloading} <span aria-hidden="true" on:click={CancelDownloadBook()}>Cancel</span>
{/if}
{#each folios as [nfolio,folioid,pars]}
<div class="book">
{#key $tosim}
<span aria-hidden="true" class:dimmed={!$folioincache[folioid]} on:click={()=>selectfolio(nfolio)} 
    class:selecteditem={samesutra($activefolioid,folioid)} >{getFolioName(nfolio)}</span>

{#if $vip=='YAP' && !downloading && samesutra($activefolioid,folioid) && getAllFolio(usePtk(aptk) ,folioid).length>1 }
<span aria-hidden="true" on:click={downloadBook(folioid)}>Download All</span>
{/if}
<Favoritebuttons {folioid} {closePopup}/>
{#each pars as par}
{#if $folioincache[getFolioId(par)] || $online}
<span aria-hidden="true" class="parallelfolio" on:click={()=>selectfolio(par)} 
    class:dimmed={!$folioincache[getFolioId(par)]}
    class:selecteditem={$activefolioid==getFolioId(par)} >
{getFolioName(par)}</span>
<Favoritebuttons folioid={getFolioId(par)} {closePopup} />
{/if}

{/each}
{/key}
</div>
{/each}

{:else}
<div class="bodytext">
<span aria-hidden="true" class="clickable hyperlink" on:click={()=>installptk(aptk)}>安裝 {downloadmessage}</span>
{#if aptk=="ylz-vny"}
<br/>{_("包含聲聞戒律，在家居士閱讀應有充份理由。")}
{/if}
</div>
{/if}
<div class="bodytext">
<Endmarker/>
</div>