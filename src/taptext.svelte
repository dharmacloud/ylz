<script>
import DictPopup from "./dictpopup.svelte"
import {guessEntry } from "ptk";
export let tofind='';
export let ptk;
export let address='';
let def='';
const onDict=async (t)=>{
    const entry=guessEntry( t,ptk.defines.e.fields.id.values);
    const defs=await ptk.fetchAddress('e#'+entry);
    if (defs.length) {
        def=defs.join('\n')
        showdict=true;
        showmainmenu=false;
    }
}

$: onDict(tofind)
</script>
<DictPopup {def} {ptk}/>