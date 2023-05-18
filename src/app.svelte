<script>
import SwipeGallery from "./swipegallery.svelte";
const items=[]
for (let i=62;i>0;i--) {
    items.push('vcpp/'+i.toString().padStart(2,'0')+'.jpg');
}
</script>

<div class="app">
<SwipeGallery {items}/>
</div>

<style>
.app {height:100vh} /* splitpane divider need this */
</style>