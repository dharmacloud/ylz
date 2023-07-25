<script>
import {activefolioid} from './store.js'
import InputNumber from './comps/inputnumber.svelte';
import { goPb, loadFolio,allJuan } from './nav.js';
export let closePopup;
export let ptk;
let juans=[]; //find out all juan
let thejuan=[0,0],currentjuan='1';

const gojuan=(juan)=>{
    const bkid=$activefolioid;
    const m=bkid.match(/([a-z]+)(\d+$)/);
    loadFolio( ptk,m[1]+juan,function(){
        goPb(ptk,'1');
        closePopup();
    });
}
let timer;
const gojuan2=(juan)=>{
    clearTimeout(timer);
    timer=setTimeout(()=>{
        gojuan(juan)
    },1500);
    return juan;
}
const loadJuan=(folioid)=>{
    if (!ptk) return;
    const m=folioid.match(/([a-z]+)(\d+$)/);
    if (!m) return [];
    currentjuan=m[2];
    thejuan[0]=parseInt(currentjuan);
    juans=allJuan(ptk,folioid);
}
$: loadJuan($activefolioid);
</script>
<span class="toctext">
{#if juans.length==0}
<span></span>
{:else if juans.length>9}
<InputNumber onChange={(v)=>gojuan2(v)} min=1 max={juans.length} value={currentjuan||1}/>
{:else}
卷
{#each juans as juan}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<span on:click={()=>gojuan(juan)} class="favoriteitem" class:selected={currentjuan==juan}>{juan}</span>
{/each}

{/if}
</span>