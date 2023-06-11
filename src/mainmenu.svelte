<script>
import Foliolist from './foliolist.svelte'   
export let ptk;
export let onclose;
</script>
<div class="popup">
<Foliolist {ptk} {onclose}/>

</div>
<style>
</style>