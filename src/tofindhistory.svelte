<script>
import {tofindhistory,removeTofind,tofind} from './store.js'
$:items = $tofindhistory.slice(0,$tofindhistory.length);

export const setTofind=tf=>{
    tofind.set(tf);
}
</script>
<div class="bodytext">
{#each items as item}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<span on:click={()=>setTofind(item)}>{item}</span><!-- svelte-ignore a11y-click-events-have-key-events --><span 
on:click={()=>removeTofind(item)} class="delete clickable">✕</span>
{/each}
</div>