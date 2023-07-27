<script>
import {activefolioid} from './store.js'
import Pager from './comps/pager.svelte'
import { goPb, loadFolio,allJuan } from './nav.js';
export let closePopup;
export let ptk;
let juans=[]; //find out all juan
let currentjuan=0;

const gojuan=(juan)=>{
    const fid=$activefolioid;
    const newid=fid.replace(/\d+$/,juan);
    if (newid==fid) return;
    loadFolio( newid,function(){
        goPb('1');
        closePopup();
        loadJuan(newid)
    });
}

const loadJuan=(folioid)=>{
    if (!ptk) return;
    const m=folioid.match(/([a-z]+)(\d+$)/);
    if (!m) return [];
    currentjuan=parseInt(m[2])-1;
    juans=allJuan(ptk,folioid).map((it,idx)=>{
        return {caption:it, idx:parseInt(idx), id:(idx+1).toString() }
    });
}

$: loadJuan($activefolioid);
</script>
卷
{#if juans.length==0}
<span></span>
{:else}
<Pager pages={juans} now={currentjuan} let:active let:caption  let:id>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<span on:click={()=>gojuan(id)} class="clickable" class:selected={active}>{caption}</span>
</Pager>
{/if}
