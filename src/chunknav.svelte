<script>
export let ptk;
import Pager from './comps/pager.svelte';
import { styledNumber } from 'ptk';
import { bookByFolio,activefolioid,tapmark,foliotext } from './store.js';
import { goChunk} from './nav.js';

let cknow=0;
const chunks=[];

const loadChunks=()=>{
    const ft=$foliotext;
    if (!ft||!ft.fromFolioPos) return;
    const {ckid}=ft.fromFolioPos($tapmark);
    //if (ckid==chunks[cknow]?.ckid) return;

    const book=bookByFolio($activefolioid)
    const [from,to]=ptk.rangeOfAddress('bk#'+book);
    const [start,end]=ptk.tagInRange('ck',from,to);
    const ck=ptk.defines.ck;
    let idx=0;
    chunks.length=0;
    const tapckid=ckid;
    for (let ckat=start;ckat<=end;ckat++ ) {
        const ckid=ck.fields.id.values[ckat];
        const styled=parseInt(ckid)?styledNumber(parseInt(ckid),'①'):(ckid+'.');
        chunks.push({caption:styled+ck.innertext.get(ckat) ,idx, id:ckat, ckid} ); //id is pager id
        if (ckid==tapckid) cknow=idx;
        idx++;
    }   
}

const gochunk=(idx)=>{
    const ckat=chunks[idx].id;
    const ck=ptk.defines.ck;
    const ckid=ck.fields.id.values[ckat];

    goChunk(ptk,bookByFolio($activefolioid),ckid);
    cknow=idx;
}
$: loadChunks($tapmark);
</script>

<Pager onselect={gochunk} pages={chunks} nextitems={2} now={cknow} let:active let:caption let:idx>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<span on:click={()=>gochunk(idx)} class="clickable" class:selected={active}>{caption}</span>
</Pager>