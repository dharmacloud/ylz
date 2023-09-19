<script>
import Translations from './translations.svelte'
import ChunkText from './chunktext.svelte'
import SourceText from './sourcetext.svelte'
import Variorum from './variorum.svelte'
import SearchMain from  './searchmain.svelte'
import Externals from './externals.svelte'
import ParText from './partext.svelte'
import {_} from './textout'
import {usePtk,parseAction, toChineseNumber} from 'ptk'
import {tosim,activefolioid,activepb, leftmode,activePtk,
    hasVariorum,hasTranslation,hasSanskrit,bookByFolio, tapmark,foliotext} from './store.js'
$: ptk=usePtk($activePtk);
export let closePopup;

const humanAddress=addr=>{
    const act=parseAction(addr);
    let out='',isNikaya=false;
    for (let i=0;i<act.length;i++) {
        const [tagname,v]=act[i];
        if (tagname=='bk') {
            // if (v=='agms') out+='';
            if (v=='agmm') out+='中';
            else if (v=='agmss') out+='別';
            else if (v=='agmd') out+='長';
            else if (v=='agmu') out+='增';
            
        } else if (tagname=='ak') {
            if (v=='mn') out+='中部';
            else if (v=='dn') out+='長部';
            else if (v=='an') out+='增支';
            else if (v=='sn') out+='相應';
            isNikaya=!!v.match(/[dmsa]n/);
        } else if (tagname=='ck') {
            if (isNikaya) {
                if (out=='相應') {
                    out=v.slice(1)+out;
                } else if (out=='增支') {
                    out+=v.slice(1)+'集';
                } else {
                    out+=v.slice(1)+'經';
                }
            } else {
                const [start]=ptk.rangeOfAddress(addr);
                const ck=ptk.nearestChunk(start);
                out+=ck?.caption.replace(/\d+$/g,'')||''; //remove tailing number
            }
        } else if (tagname=='n') {
            out+=v+'經';
        }
    }
    return out+" ";
}
const getLinks=folioid=>{
    //todo 更精準地定位 經 ，目前是以頁首，有時是上一經
    const dcptk=usePtk("dc");
    const [from,to]=ptk.rangeOfAddress('folio#'+folioid+'.pb#'+($activepb));
    const externals=[],internals=[];
    const agmsjuan=folioid.match(/agms(\d+)$/);
    const ft=$foliotext;
    if (!ft) return [[],[]];
    let col,key;
    if (agmsjuan) {
        const at=ptk.nearestTag( to+1 ,'n')  ;
        const n=ptk.defines.n;
        key=parseInt(n.fields.id.values[at]);
        caption=_('雜')+key+_('導讀');
        url='https://buddhaspace.org/agama/'+agmsjuan[1]+'.html#'+toChineseNumber(key);
        externals.push([ caption, url]);
        col=dcptk.columns['par_agms'];
    }

    const agmssjuan=folioid.match(/agmss(\d+)$/);
    if (agmssjuan) {
        const at=ptk.nearestTag( to+1 ,'n')  ;
        const n=ptk.defines.n;
        key=parseInt(n.fields.id.values[at]);
        col=dcptk.columns['par_agmss'];
    }
   
    const agmdjuan=folioid.match(/agmd(\d+)$/);
    if (agmdjuan) {
        const cl=ft.fromFolioPos($tapmark);
        if (cl&&cl.ckid) {
            caption='長'+parseInt(cl.ckid)+_('導讀');
            url='https://buddhaspace.org/agama3/'+parseInt(cl.ckid)+'.html';
            key=cl.ckid;
            externals.push([ caption, url]);
        }
        col=dcptk.columns['par_agmd']
    }
    const agmmjuan=folioid.match(/agmm(\d+)$/);
    if (agmmjuan) {
        const cl=ft.fromFolioPos($tapmark);
        if (cl&&cl.ckid) {
            key=cl.ckid;
            caption='中'+parseInt(cl.ckid)+_('導讀');
            url='https://buddhaspace.org/agama2/sub/'+cl.ckid+'.html';
            externals.push([ caption, url]);
        }
        col=dcptk.columns['par_agmm']
    }
    const agmujuan=folioid.match(/agmu(\d+)$/);
    if (agmujuan) {
        col=dcptk.columns['par_agmu']
        const cl=ft.fromFolioPos($tapmark);
        if (cl&&cl.ckid) {
            key=cl.ckid;
        }
    }

    
    if (col && key) {
        const at2=col.keys.indexOf(key.toString());
        const pars=(col.parallels[at2]||'').split(',');
        
        for (let i=0;i<pars.length;i++) {
            const par=pars[i];
            if (par.match(/ak#[dmsa]n/)) {
                const host=location.host.replace('5000','5080');
                const url=location.protocol+'//'+host+location.pathname.replace('ylz','sz')+'#'+par;
                externals.push([humanAddress(par),url]);
            } else {
                internals.push([humanAddress(par),par]);
            }
        }
        
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
<span class='clickable' class:selected={thetab=="search"} on:click={()=>selecttab("search")}>{_("搜尋",$tosim)}</span>    

<!-- svelte-ignore a11y-click-events-have-key-events -->
<span class='clickable' class:selected={thetab=="chunktext"} on:click={()=>selecttab("chunktext")}>全文</span>    

{#if hasSanskrit(bookByFolio($activefolioid))}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<span class='clickable' class:selected={thetab=="sourcetext"} on:click={()=>selecttab("sourcetext")}>原文</span>    
{/if}
{#if hasTranslation(ptk,bookByFolio($activefolioid))}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<span class='clickable' class:selected={thetab=="translations"} on:click={()=>selecttab("translations")}>{_("別譯",$tosim)}</span>
{/if}
{#if hasVariorum(bookByFolio($activefolioid))}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<span class='clickable' class:selected={thetab=="variorum"} on:click={()=>selecttab("variorum")}>{_("集註",$tosim)}</span>    
{/if}

{#each internals as internal,idx}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<span class='clickable' class:selected={thetab=="link"+idx} on:click={()=>selecttab("link"+idx)}>{internal[0]}</span> 
{/each}


{#key externals}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<Externals {closePopup} links={externals}/>
{/key}


</div>
<div class="subtab-content" class:visible={thetab=='search'}><SearchMain {ptk} /></div>
<div class="subtab-content" class:visible={thetab=='chunktext'}><ChunkText {ptk}  /></div>
<div class="subtab-content" class:visible={thetab=='sourcetext'}><SourceText {ptk}/></div>
<div class="subtab-content" class:visible={thetab=='translations'}><Translations {closePopup} {ptk}/></div>
<div class="subtab-content" class:visible={thetab=='variorum'}><Variorum {closePopup}/></div>
{#each internals as internal,idx}
<div class="subtab-content" class:visible={thetab=="link"+idx}><ParText {closePopup} caption={internal[0]} {ptk} address={internal[1]}/></div>
{/each}
    
    

