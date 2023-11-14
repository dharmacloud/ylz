<script>
import {tofindhistory,removeTofind,tofind} from './store.js'
$:items = $tofindhistory.slice(0,$tofindhistory.length);

export const setTofind=tf=>{
    
    tofind.set(tf);
}
$: console.log('tofind',$tofind)
</script>
<div class="bodytext">
{#each items as item}
<span aria-hidden="true" class="clickable" on:click={()=>setTofind(item)}>{item}</span><span aria-hidden="true" 
on:click={()=>removeTofind(item)} class="delete clickable">✕</span>
{/each}
</div>