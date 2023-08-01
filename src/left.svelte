<script>
import Chunktext from './chunktext.svelte';
import InputHelper from './inputhelper.svelte'
import {leftmode,lefttextline,folioHolderWidth,landscape} from './store.js'
export let ptk;
</script>

<div class="left" style={"width:"+folioHolderWidth($landscape)}>
{#if $leftmode=='input'}
<InputHelper {ptk}/>
{:else if $leftmode=='lefttext'}
<Chunktext {ptk} ptkline={$lefttextline} />
{/if}
</div>

<style>
.left {position:absolute;top:0;height: 100%;overflow-y: auto;}
</style>