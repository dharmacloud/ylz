<script>
import {activefolioid,loadingbook} from './store.js'
import Pager from './comps/pager.svelte'
import { goPb, loadFolio,allJuan } from './nav.js';
export let closePopup;
export let ptk;
let juans=[]; //find out all juan
const m=$activefolioid.match(/([a-z]+)(\d+$)/);
let currentjuan=m?parseInt(m[2])-1:0;

const gojuan=(idx)=>{
    const juan=juans[idx].id;
    const fid=$activefolioid;
    const newid=fid.replace(/\d+$/,juan);
    if (newid==fid) return;
    loadFolio( newid,function(){
        goPb('1');
        closePopup();
        loadJuan(newid)
    });
}

const loadJuan=(folioid,loading)=>{
    if (!ptk || loading) return [];
    const m=folioid.match(/([a-z]+)(\d+$)/);
    if (!m) return [];
    currentjuan=parseInt(m[2])-1;
    return allJuan(ptk,folioid).map((it,idx)=>{
        return {caption:it, idx:parseInt(idx), id:(idx+1).toString() }
    });    
}

$: juans=loadJuan($activefolioid,$loadingbook);
</script>
{#if juans.length==0}
<span></span>
{:else}
<Pager pages={juans} caption="卷" now={currentjuan} let:active let:caption  let:idx onselect={gojuan}>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<span on:click={()=>gojuan(idx)} class="clickable" class:selected={active}>{caption}</span>
</Pager>
{/if}
