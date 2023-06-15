<script>
import Foliolist from './foliolist.svelte'   
import Setting from './setting.svelte'
export let ptk;
export let onclose;
let thetab='list';
</script>
<div class="popup">
    <div class="tabs">    
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <span class='clickable' class:selected={thetab=="list"} on:click={()=>thetab="list"}>經錄</span>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <span class='clickable' class:selected={thetab=="setting"} on:click={()=>thetab="setting"}>設置</span>

    </div>
    <div class="tab-content" class:visible={thetab=='list'}><Foliolist {ptk} {onclose}/></div>
    <div class="tab-content" class:visible={thetab=='setting'}><Setting/></div>
</div>
<style>
</style>