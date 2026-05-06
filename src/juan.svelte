<script>
import {booknameOf,activePtk,activefolioid,loadingfolio,tapmark,activepb,tapAddress} from './store.js'
import Pager from './comps/pager.svelte'
import { loadFolio,loadJuan } from './nav.js';
import {updateUrl,debounce, usePtk} from 'ptk'
export let closePopup;

let juans=[]; //find out all juan
const m=$activefolioid.match(/([a-z_]+)(\d+$)/);
let currentjuan=m?parseInt(m[2]):1;
const gojuan=(j)=>{
    const fid=$activefolioid;
    const newid=fid.replace(/\d+$/,j);
    if (newid==fid) return;
    loadFolio( newid,function(){
        activepb.set('1');
        tapmark.set(['0',0,0]);
        updateUrl(tapAddress());
        closePopup();
        loadJuan(ptk,newid);
    });
}
$: ptk=usePtk($activePtk)

const gotojuan=e=>{
    const max=parseInt(juans[juans.length-1].caption);
    if (currentjuan<1) currentjuan=1;
    if (currentjuan>max) currentjuan=max;
    gojuan(currentjuan)
}
$: juans=loadJuan(ptk,$activefolioid,$loadingfolio);
$: bookname=booknameOf($activefolioid,ptk)

</script>
{bookname}
{#if juans.length==0}
<span></span>
{:else if juans.length<10}
<Pager pages={juans} caption="卷" now={currentjuan} let:active let:caption  let:id  onselect={idx=>gojuan(idx+1)}>
    <span aria-hidden="true" on:click={()=>gojuan(id)} class="clickable" class:selected={active}>{caption}</span>
</Pager>
{:else}
<button on:click={()=>gojuan(currentjuan+1)} disabled={currentjuan==juans[juans.length-1].caption}>下一卷</button><br/>
<input type="number" bind:value={currentjuan} name="juan" on:input={debounce(gotojuan,1000)} style="width:3em" />{juans[0].caption>1?(juans[0].caption+'至'):''}{juans[juans.length-1].caption}卷，
{/if}
