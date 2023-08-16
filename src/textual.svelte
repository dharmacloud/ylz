<script>
import Translations from './translations.svelte'
import ChunkText from './chunktext.svelte'
import SourceText from './sourcetext.svelte'
import Variorum from './variorum.svelte'
import SearchMain from  './searchmain.svelte'
import Externals from './externals.svelte'
import ParText from './partext.svelte'
import {parseAction, toChineseNumber} from 'ptk'
import {activefolioid,activepb, leftmode,hasVariorum,hasTranslation,hasSanskrit,bookByFolio, tapmark,foliotext} from './store.js'
export let ptk;
export let closePopup;

const humanAddress=addr=>{
    const act=parseAction(addr);
    let out='';
    for (let i=0;i<act.length;i++) {
        const [tagname,v]=act[i];
        if (tagname=='bk') {
            // if (v=='agms') out+='';
            if (v=='agmm') out+='中';
            else if (v=='agmss') out+='別';
            else if (v=='agmd') out+='長';
            else if (v=='agmu') out+='增';
        } else if (tagname=='ck') {
            const [start]=ptk.rangeOfAddress(addr);
            const ck=ptk.nearestChunk(start);
            out+=ck?.caption.replace(/\d+$/g,'')||''; //remove tailing number
        } else if (tagname=='n') {
            out+=v+'經';
        }
    }
    return out+" ";
}
const getLinks=folioid=>{
    //todo 更精準地定位 經 ，目前是以頁首，有時是上一經
    const [from,to]=ptk.rangeOfAddress('folio#'+folioid+'.pb#'+($activepb));
    const externals=[],internals=[];
    const agmsjuan=folioid.match(/agms(\d+)$/);
    let col,key;
    if (agmsjuan) {
        const at=ptk.nearestTag( to+1 ,'n') -1 ;
        const n=ptk.defines.n;
        key=parseInt(n.fields.id.values[at]);
        caption='雜'+key+'導讀';
        url='https://buddhaspace.org/agama/'+agmsjuan[1]+'.html#'+toChineseNumber(key);
        externals.push([ caption, url]);
        col=ptk.columns['par_agms'];
    }

    const agmssjuan=folioid.match(/agmss(\d+)$/);
    if (agmssjuan) {
        const at=ptk.nearestTag( to+1 ,'n') -1 ;
        const n=ptk.defines.n;
        key=parseInt(n.fields.id.values[at]);
        col=ptk.columns['par_agmss'];
    }
   
    const agmdjuan=folioid.match(/agmd(\d+)$/);
    if (agmdjuan) {
        const {ckid}=$foliotext.fromFolioPos($tapmark);
        if (ckid) {
            caption='長'+parseInt(ckid)+'導讀';
            url='https://buddhaspace.org/agama3/'+parseInt(ckid)+'.html';
            key=ckid;
            externals.push([ caption, url]);
        }
        col=ptk.columns['par_agmd']
    }
    const agmmjuan=folioid.match(/agmm(\d+)$/);
    if (agmmjuan) {
        const {ckid}=ft.fromFolioPos($tapmark);
        if (ckid) {
            key=keyid;
            caption='中'+parseInt(ckid)+'導讀';
            url='https://buddhaspace.org/agama2/sub/'+ckid+'.html';
            externals.push([ caption, url]);
        }
        col=ptk.columns['par_agmm']
    }
    const agmujuan=folioid.match(/agmu(\d+)$/);
    if (agmujuan) {
        col=ptk.columns['par_agmu']
    }

    if (col && key) {
        const at2=col.keys.indexOf(key.toString());
        const pars=(col.parallels[at2]||'').split(',');
        internals.push(... pars.map(par=>[humanAddress(par),par]));
    }
    if (thetab.startsWith('link')) {
        thetab='chunktext'
    }
    return [externals,internals];
}
const selecttab=tabname=>{
    leftmode.set('folio')
    thetab=tabname;
}
let thetab='search';
$: [externals,internals]=getLinks($activefolioid,$activepb);

</script>
<div class="tabs">    

<!-- svelte-ignore a11y-click-events-have-key-events -->
<span class='clickable' class:selected={thetab=="search"} on:click={()=>selecttab("search")}>搜尋</span>    

<!-- svelte-ignore a11y-click-events-have-key-events -->
<span class='clickable' class:selected={thetab=="chunktext"} on:click={()=>selecttab("chunktext")}>全文</span>    

{#if hasSanskrit(bookByFolio($activefolioid))}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<span class='clickable' class:selected={thetab=="sourcetext"} on:click={()=>selecttab("sourcetext")}>原文</span>    
{/if}
{#if hasTranslation(ptk,bookByFolio($activefolioid))}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<span class='clickable' class:selected={thetab=="translations"} on:click={()=>selecttab("translations")}>別譯</span>
{/if}
{#if hasVariorum(ptk,bookByFolio($activefolioid))}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<span class='clickable' class:selected={thetab=="variorum"} on:click={()=>selecttab("variorum")}>集註</span>    
{/if}

{#each internals as internal,idx}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<span class='clickable' class:selected={thetab=="link"+idx} on:click={()=>selecttab("link"+idx)}>{internal[0]}</span> 
{/each}


{#if externals.length}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<Externals {closePopup} links={externals}/>
{/if}


</div>
<div class="subtab-content" class:visible={thetab=='search'}><SearchMain {ptk} /></div>
<div class="subtab-content" class:visible={thetab=='chunktext'}><ChunkText {ptk}  /></div>
<div class="subtab-content" class:visible={thetab=='sourcetext'}><SourceText {ptk}/></div>
<div class="subtab-content" class:visible={thetab=='translations'}><Translations {closePopup} {ptk}/></div>
<div class="subtab-content" class:visible={thetab=='variorum'}><Variorum {closePopup} {ptk}/></div>
{#each internals as internal,idx}
<div class="subtab-content" class:visible={thetab=="link"+idx}><ParText {closePopup} caption={internal[0]} {ptk} address={internal[1]}/></div>
{/each}
    
    

