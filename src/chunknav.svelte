<script>
export let ptk;
import Pager from './comps/pager.svelte';
import { styledNumber } from 'ptk';
import { activepb,bookByFolio,activefolioid,tapmark,foliotext } from './store.js';

let cknow=0;
const chunks=[];

const loadChunks=()=>{
    const ft=$foliotext;
    if (!ft||!ft.fromFolioPos) return;
    const {ckid}=ft.fromFolioPos($tapmark);
    if (ckid==chunks[cknow]?.ckid) return;

    const book=bookByFolio($activefolioid)
    const [from,to]=ptk.rangeOfAddress('bk#'+book);
    const [start,end]=ptk.tagInRange('ck',from,to);
    const ck=ptk.defines.ck;
    let idx=0;
    chunks.length=0;
    for (let ckat=start;ckat<=end;ckat++ ) {
        const ckid=ck.fields.id.values[ckat];
        const styled=parseInt(ckid).toString()==ckid?styledNumber(parseInt(ckid),'①'):(ckid+'.');
        chunks.push({caption:styled+ck.innertext.get(ckat) ,idx, id:ckat, ckid} ); //id is pager id
        idx++;
    }
}

const gochunk=(idx)=>{
    const ckat=chunks[idx].id;
    const ck=ptk.defines.ck;
    const ckid=ck.fields.id.values[ckat];
    const ft=$foliotext;
    const fpos=ft.toFolioPos(ckid);
    activepb.set(fpos[0]);
    tapmark.set(fpos)
    cknow=idx;
}
$: loadChunks($tapmark);
</script>

<Pager pages={chunks} nextitems={1} now={cknow} let:active let:caption let:idx>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<span on:click={()=>gochunk(idx)} class="clickable" class:selected={active}>{caption}</span>
</Pager>