<script>
import { usePtk } from 'ptk';
import InputHelper from './inputhelper.svelte'
import {leftmode,folioHolderWidth,landscape,activePtk} from './store.js'
$: ptk= usePtk($activePtk);
</script>

<div class="left" style={"width:"+folioHolderWidth($landscape)}>
{#if $leftmode=='input'}
<InputHelper {ptk}/>
{/if}

</div>

<style>
.left {position:absolute;top:0;height: 100%;overflow-y: auto;}
</style>