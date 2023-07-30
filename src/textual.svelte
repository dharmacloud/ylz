<script>
import Translations from './translations.svelte'
import ChunkText from './chunktext.svelte'
import SourceText from './sourcetext.svelte'
import Variorum from './variorum.svelte'
import SearchMain from  './searchmain.svelte'
import Externals from './externals.svelte'
import {toChineseNumber} from 'ptk'
import {activefolioid,activepb, hasVariorum,hasTranslation,hasSanskrit,bookByFolio} from './store.js'
export let ptk;
export let closePopup;

const getExternalLinks=folioid=>{
    //todo 更精準地定位 經 ，目前是以頁首，有時是上一經
    const [from,to]=ptk.rangeOfAddress('folio#'+folioid+'.pb#'+($activepb+1));
    const n=ptk.defines.n;
    const at=ptk.nearestTag( to+1 ,'n') -1 ;
    const out=[]
    if (~at) {
        const sutra=parseInt(n.fields.id.values[at]);
        const juan=folioid.match(/agms(\d+)$/);
        if (juan) {
            caption=juan[1]+'卷'+sutra+'經導讀(獅子吼)';
            url='https://buddhaspace.org/agama/'+juan[1]+'.html#'+toChineseNumber(sutra);
            out.push([ caption, url]);
        }
    }
    return out;
}
let thetab='chunktext';
$: externallinks=getExternalLinks($activefolioid,$activepb)

</script>
<div class="tabs">    

<!-- svelte-ignore a11y-click-events-have-key-events -->
<span class='clickable' class:selected={thetab=="search"} on:click={()=>thetab="search"}>搜尋</span>    

<!-- svelte-ignore a11y-click-events-have-key-events -->
<span class='clickable' class:selected={thetab=="chunktext"} on:click={()=>thetab="chunktext"}>全文</span>    

{#if hasSanskrit(bookByFolio($activefolioid))}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<span class='clickable' class:selected={thetab=="sourcetext"} on:click={()=>thetab="sourcetext"}>原文</span>    
{/if}
{#if hasTranslation(ptk,bookByFolio($activefolioid))}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<span class='clickable' class:selected={thetab=="translations"} on:click={()=>thetab="translations"}>別譯</span>
{/if}
{#if hasVariorum(ptk,bookByFolio($activefolioid))}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<span class='clickable' class:selected={thetab=="variorum"} on:click={()=>thetab="variorum"}>集註</span>    
{/if}

{#if externallinks.length}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<span class='clickable' class:selected={thetab=="externals"} on:click={()=>thetab="externals"}>外連</span>    
{/if}


</div>
<div class="subtab-content" class:visible={thetab=='search'}><SearchMain {ptk} /></div>
<div class="subtab-content" class:visible={thetab=='chunktext'}><ChunkText {ptk}  /></div>
<div class="subtab-content" class:visible={thetab=='sourcetext'}><SourceText {ptk}/></div>
<div class="subtab-content" class:visible={thetab=='translations'}><Translations {closePopup} {ptk}/></div>
<div class="subtab-content" class:visible={thetab=='variorum'}><Variorum {closePopup}  {ptk}/></div>
<div class="subtab-content" class:visible={thetab=='externals'}><Externals {closePopup} links={externallinks}/></div>

    
    

