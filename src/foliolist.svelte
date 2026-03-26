<script>
import Favoritebuttons from './favoritebuttons.svelte';
import { loadFolio } from './nav.js';
import {deleteFromCache, downloadToCache} from 'ptk/platform/downloader.js'
import {CacheName} from './constant.js'
import {fetchFolioList} from './folio.js'
import {thetab,activefolioid,downloading, vip,tosim,parallelFolios,stopAudio,folioincache,online,activepb, activePtk, showfavorite, showinggallery} from './store.js';
import Endmarker from './endmarker.svelte';
import {ptkInCache} from './folio.js'
import {_} from './textout.js'
import { usePtk,openPtk, poolGetAll,enableAccelon23Features } from 'ptk';
import {getAllFolio} from './folio.js';
export let closePopup=function(){};
let downloadmessage='';
let folios=[];
let canceldownload=false;

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
        await downloadToCache(CacheName,"folio/"+src,msg=>{
            downloading.set(src+ " "+msg);
        });
        if (canceldownload) break;
    };
    canceldownload=false;
    downloading.set('');
    refreshList();
}
const hasDimBook=()=>{
    const F=$folioincache;
    for (let i=0;i<folios.length;i++) {
        if (!F[folios[i][1]]) return true;
    }
}
const hasDimJuan=(folioid)=>{
    const F=$folioincache;
    const juans=getAllFolio(usePtk(aptk) ,folioid);
    for (let i=0;i<juans.length;i++) {
        if (!F[juans[i]]) return true;
    }
}
const refreshList=async ()=>{
    folios.length=0;
    await fetchFolioList(folioincache);
    await getFolioList(aptk)
}
const deletecache=async (folioid)=>{
    await deleteFromCache(CacheName,'/folio/'+folioid+'.zip');
    await refreshList();
}
const downloadAll=async function (){
    canceldownload=false;
    setTimeout(async ()=>{
        for (let item of folios){
            const src=item[1]+'.zip'
            await downloadToCache(CacheName,"folio/"+src,msg=>{
                downloading.set(src+ " "+msg);
            });
            if (canceldownload) break;
        };
        downloading.set('');
        
        refreshList();
    })
}
const selectfolio=nfolio=>{
    activePtk.set(aptk);
    const folio=usePtk(aptk).defines.folio;
    const folioid=folio.fields.id.values[nfolio];
    if ($folioincache[folioid] || $online) {
        stopAudio();
        closePopup();
    }
    // console.log('select folio',nfolio,folioid)
    loadFolio(folioid,function(){
        activepb.set('1');
        thetab.set('toc');
    });
    showinggallery.set(true)
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
    <span aria-hidden="true" class="clickable" class:selected={aptk=="ylz-prjn"}  on:click={()=>aptk="ylz-prjn"}>法性</span>
    <span aria-hidden="true" class="clickable" class:selected={aptk=="ylz-tg"}  on:click={()=>aptk="ylz-tg"}>法界</span>
    <span aria-hidden="true" class="clickable" class:selected={aptk=="ylz-avts"}  on:click={()=>aptk="ylz-avts"}>{_("華嚴",$tosim)}</span>
    <span aria-hidden="true" class="clickable" class:selected={aptk=="ylz-rite"}  on:click={()=>aptk="ylz-rite"}>{_("懺儀",$tosim)}</span>
    <span aria-hidden="true" class="clickable" class:selected={aptk=="ylz-svk"}  on:click={()=>aptk="ylz-svk"}>{_("聲聞",$tosim)}</span>
    <span aria-hidden="true" class="clickable" class:selected={aptk=="ylz-vny"}  on:click={()=>aptk="ylz-vny"}>戒律</span>
</div>
{#if folios.length}
{#if $downloading}
{$downloading} <span aria-hidden="true" on:click={()=>CancelDownloadBook()}>Cancel</span>
{/if}
{#each folios as [nfolio,folioid,pars]}
{#key folioid}
<div class="book">
{#key $tosim}
<span aria-hidden="true" class:dimmed={!$folioincache[folioid]} on:click={()=>selectfolio(nfolio)} 
    class:selecteditem={samesutra($activefolioid,folioid)} >{getFolioName(nfolio)}</span>

{#if ($vip=='YAP'||$vip=='XIU') && !$downloading && samesutra($activefolioid,folioid) 
&& hasDimJuan(folioid) }
<button on:click={downloadBook(folioid)}>{_("下載本經所有卷")}</button>
{/if}
{#if $showfavorite=='on'}
<Favoritebuttons {folioid} {closePopup}/>
{/if}

{#each pars as par}
{#if $folioincache[getFolioId(par)] || $online}
<span aria-hidden="true" class="parallelfolio" on:click={()=>selectfolio(par)} 
    class:dimmed={!$folioincache[getFolioId(par)]}
    class:selecteditem={$activefolioid==getFolioId(par)} >
{getFolioName(par)}</span>

{#if $showfavorite=='on'}
<Favoritebuttons folioid={getFolioId(par)} {closePopup} />
{/if}
{/if}
{/each}



{/key}
</div>
{/key}
{/each}
{#key folios.length}
{#if ($vip=='YAP'||$vip=='XIU') && hasDimBook()}
<button on:click={()=>downloadAll()}>{_("下載此頁首卷")}</button>
{/if}
{/key}

{#if $folioincache[$activefolioid]}
<button class="deletecache" aria-hidden="true" on:click={()=>deletecache($activefolioid)}>{_("清除緩存")}:{$activefolioid}</button>
{/if}


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
