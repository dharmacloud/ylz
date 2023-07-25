<script>
import {parseAddress,parseAction} from 'ptk'
export let ptk;
export let address;
let ck

const getMaxChunk=()=>{
    const addr=parseAddress(address);
    const act=parseAction(addr.action);
    console.log(addr,act)
}
const prevChunk=()=>{

}
const nextChunk=()=>{

}

$: maxchunk=getMaxChunk(address);
</script>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<span class="navbutton" on:click={prevChunk}>←</span>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<span class="navbutton">{ck?.caption}</span>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<span class="navbutton" on:click={nextChunk}>→</span>