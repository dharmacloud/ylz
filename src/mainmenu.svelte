<script>
import Filelist from './filelist.svelte'   
export let ptk;
export let onclose;
</script>
<div class="popup">
<Filelist {ptk} {onclose}/>

</div>
<style>
</style>