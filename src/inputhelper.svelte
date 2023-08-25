<script>
import {searchable, tofind} from './store.js'
export let ptk;
let entries,starts=[],middles=[],ends=[]
const listCandidate=(tf)=>{
    starts=[];
    middles=[];
    ends=[];
    if (!tf.trim()) return ;
    if (tf.length>4) return;
    entries=ptk.columns.entries.keys;
    starts=entries.enumStart(tf,20);
    middles=entries.enumMiddle(tf,20);
    ends=entries.enumEnd(tf,20);
}
$: listCandidate($tofind)
</script>
<div class="bodytext">
{#each starts as i}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<span class="clickable" on:click={()=>searchable.set(entries.get(i))}>{entries.get(i)+" "}</span>
{/each}
</div>
<hr/>
<div class="bodytext">
<!-- svelte-ignore a11y-click-events-have-key-events -->
{#each ends as i}
<span class="clickable" on:click={()=>searchable.set(entries.get(i))}>{entries.get(i)+" "}</span>
{/each}
</div>
<hr/>
<div class="bodytext">
{#each middles as i}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<span class="clickable" on:click={()=>searchable.set(entries.get(i))}>{entries.get(i)+" "}</span>
{/each}
</div>