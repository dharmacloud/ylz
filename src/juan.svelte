<script>
import {activefolioid} from './store.js'
import InputNumber from './comps/inputnumber.svelte';
import { goPb, loadFolio,allJuan } from './nav.js';
export let closePopup;
export let ptk;
let juans=[]; //find out all juan
let thejuan=[0,0],currentjuan='1';

const gojuan=(juan)=>{
    if (parseInt(juan)==parseInt(currentjuan)) return;
    const bkid=$activefolioid;
    const m=bkid.match(/([a-z]+)(\d+$)/);
    const newjuan=m[1]+juan;
    console.log(newjuan);
    loadFolio( newjuan,function(){
        goPb('1');
        closePopup();
    });
}
let timer;
let neighborJuans=[];
const loadJuan=(folioid)=>{
    if (!ptk) return;
    const m=folioid.match(/([a-z]+)(\d+$)/);
    if (!m) return [];
    currentjuan=m[2];
    thejuan[0]=parseInt(currentjuan);
    juans=allJuan(ptk,folioid);

    const juan=parseInt(currentjuan);
    let left=juan-3;
    let right=juan+3;
    if (left<2) left=2;
    if (right>=juans.length) right=juans.length-1;
    neighborJuans=[];
    for (let j=left;j<=right;j++) {
        neighborJuans.push(j.toString())
    }
}

$: loadJuan($activefolioid);
</script>
卷
{#if juans.length==0}
<span></span>
{:else if juans.length>9}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<span on:click={()=>gojuan("1")} class="favoriteitem" class:selected={currentjuan=="1"}>{1}</span>
{#each neighborJuans as juan}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<span on:click={()=>gojuan(juan)} class="favoriteitem" class:selected={currentjuan==juan}>{juan}</span>
{/each}

<!-- svelte-ignore a11y-click-events-have-key-events -->
<span on:click={()=>gojuan(juans.length)} class="favoriteitem" class:selected={currentjuan==juans.length}>{juans.length}</span>
{:else}
卷
{#each juans as juan}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<span on:click={()=>gojuan(juan)} class="favoriteitem" class:selected={currentjuan==juan}>{juan}</span>
{/each}

{/if}
