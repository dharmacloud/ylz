<script>
import { parseOfftext } from "ptk";
import { loadAddress } from "./nav.js";
export let address;
export let ptk;
export let caption;
let lines=[];
const fetchContent=async()=>{
    lines=await ptk.fetchAddress(address);
}
const gofolio=()=>{
    loadAddress(ptk,address);
}
$: fetchContent(address);
</script>
<div class="bodytext">
<!-- svelte-ignore a11y-click-events-have-key-events -->
<span class="clickable" on:click={gofolio}>←{caption}</span>
{#each lines as line}
<div>{parseOfftext(line)[0]}</div>
{/each}
</div>