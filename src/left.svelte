<script>

import TofindHistory from './tofindhistory.svelte'
import InputHelper from './inputhelper.svelte'
import {leftmode,folioHolderWidth,landscape,tofind} from './store.js'
export let ptk;
</script>

<div class="left" style={"width:"+folioHolderWidth($landscape)}>
{#if $leftmode=='input'}
<InputHelper {ptk}/>
{/if}

</div>

<style>
.left {position:absolute;top:0;height: 100%;overflow-y: auto;}
</style>