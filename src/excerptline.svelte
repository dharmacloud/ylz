<script>
import {_} from './textout.ts'
import Abridge from './comps/abridge.svelte';
export let linetext='';
export let line=0;
export let hits=[];
export let phraselength=[];
export let gochar=function(choff){}
</script>

<Abridge {phraselength} text={linetext} {hits} let:tk>
{#if tk.highlight}<span aria-hidden="true" class="clickable hl0" on:click={()=>gochar(line,tk.choff)}>{tk.text}</span>{:else}{tk.text}{/if}
</Abridge>

