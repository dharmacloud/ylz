<script>
import {parseAddress,parseAction, styledNumber, usePtk} from "ptk";
import SentenceNav from "./sentencenav.svelte";
import {tapAddress,loadingfolio} from './store.js'
import Endmarker from "./endmarker.svelte";
import {_} from './textout.js'
let text='';

const updateVariorum=async (address,loading)=>{
    const ptk=usePtk("dc");
    const r=ptk.defines.r;
    if (!r || loading) return ;
    const addr=parseAddress(address);
    const obj=parseAction(addr.action,true);
    if (!obj)return;
    const id=obj.ck+':'+addr.highlightline;
    
    let at=r.fields.id.values.indexOf(id);
    if (~at) {
        const from=r.linepos[at];
        let to=r.linepos[at+1];//need terminator at the end
        at++;
        while (to==from) {
            at++;
            to=r.linepos[at];
        }
        await ptk.loadLines([[from,to+1]]);
        const lines=ptk.slice(from,to+1);
        if (lines[lines.length-1].indexOf('^ck')) lines.pop();//drop ^ck line at the end
        if (lines.length) {
            lines[0]='<div class="sourcetext">'+lines[0].replace(/\^r(\d+):/g,(m,m1)=>styledNumber(m1))+'</div>';
        }
        text=lines.join('<br/>');
    }
}
$: updateVariorum(tapAddress(),$loadingfolio)
</script>

<div class="bodytext">
<SentenceNav ptk={usePtk('dc')} />
{@html _(text)}

<SentenceNav ptk={usePtk('dc')} />
<Endmarker/>
</div>

