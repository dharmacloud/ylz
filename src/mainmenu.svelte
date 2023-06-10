<script>
import Filelist from './filelist.svelte'   
export let ptk;
export let onclose;
</script>
<div class="popup">
<Filelist {ptk} {onclose}/>

</div>
<style>
    .entry {font-size:8vh}
    .text {font-size:5vh}
    .popup {position:absolute;top:5%;left:5%;width:90%;height:90%;background:#dfdfdf}
    .clickable {text-decoration: underline;}
</style>