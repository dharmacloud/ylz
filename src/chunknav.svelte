<script>
export let ptk;
export let address;
export let ck
import Pager from './comps/pager.svelte';
    import { bookByFolio,activefolioid } from './store';
let cknow=0;
const chunks=[];

const loadChunk=()=>{
    const book=bookByFolio($activefolioid)
    const [from,to]=ptk.rangeOfAddress('bk#'+book);
    const [start,end]=ptk.tagInRange('ck',from,to);
    const ck=ptk.defines.ck;
    let idx=0;
    chunks.length=0;
    for (let ckat=start;ckat<end;ckat++ ) {
        chunks.push({caption:ck.innertext.get(ckat) ,idx, id:ckat} );
        idx++;
    }
}

const gochunk=(idx)=>{
    const ckat=chunks[idx].id;
    const ck=ptk.defines.ck;
    const id=ck.fields.id.values[ckat];
    if (!~address.indexOf('ck')) address+='.ck#'+id;
    else address=address.replace(/ck#?[a-z\d]+:?\d*/,'ck#'+id);
    cknow=idx;
}
$: loadChunk(address);
$: console.log(address); //ck beyond folio
</script>

<Pager pages={chunks} nextitems={1} now={cknow} let:active let:caption let:idx>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<span on:click={()=>gochunk(idx)} class="clickable" class:selected={active}>{caption}</span>
</Pager>