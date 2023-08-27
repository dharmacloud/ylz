<script>
import {activefolioid,loadingfolio,tapmark,activepb,tapAddress} from './store.js'
import Pager from './comps/pager.svelte'
import { loadFolio,allJuan } from './nav.js';
import {updateUrl,debounce} from 'ptk'
import Slider from './3rd/rangeslider.svelte';
export let closePopup;
export let ptk;
let juans=[]; //find out all juan
const m=$activefolioid.match(/([a-z]+)(\d+$)/);
let currentjuan=m?parseInt(m[2]):1;
let juan=[1,0];
const gojuan=(juan)=>{
    const fid=$activefolioid;
    const newid=fid.replace(/\d+$/,juan);
    if (newid==fid) return;
    console.log('juan',juan)
    loadFolio( newid,function(){
        activepb.set('1');
        tapmark.set(['1',0,0]);
        updateUrl(tapAddress());
        closePopup();
        loadJuan(newid);
    });
}

const loadJuan=(folioid,loading)=>{
    if (!ptk || loading) return [];
    const m=folioid.match(/([a-z]+)(\d+$)/);
    if (!m) return [];
    currentjuan=parseInt(m[2]);
    juan[0]=currentjuan;
    return allJuan(ptk,folioid).map((it,idx)=>{
        return {caption:it, idx:parseInt(idx), id:(idx+1).toString() }
    });
}
const gotojuan=e=>{
    const j=((e.detail[0]||1)).toString();
    gojuan(j)
}
$: juans=loadJuan($activefolioid,$loadingfolio);
</script>
{#if juans.length==0}
<span></span>
{:else if juans.length<10}
<Pager pages={juans} caption="卷" now={currentjuan-1} let:active let:caption  let:id  onselect={idx=>gojuan(idx+1)}>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <span on:click={()=>gojuan(id)} class="clickable" class:selected={active}>{caption}</span>
    </Pager>  
{:else}
<Slider bind:value={juan} on:input={debounce(gotojuan,300)} max={juans.length} min={1} >
    <span slot="caption" style="float:right">卷{(juan[0]||1)}/{juans.length}</span></Slider>

{/if}
