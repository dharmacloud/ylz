<script>
import {favortypes,favorites, activepb} from './store.js';
import { loadFolio } from './nav.js';
export let folioid;
export let closePopup;
let favors=[]
const _favorites=$favorites[folioid];
for (let i in _favorites) {               
    if (_favorites[i]) favors.push([ parseInt(i), _favorites[i]]);
}
const gofavor=(pb)=>{
    loadFolio(folioid,()=>{
        activepb.set(pb);
    });
    closePopup();
}
</script>

{#each favors as [pb,favor]}
<span aria-hidden="true" on:click={()=>gofavor(pb)}>{favortypes[favor]}</span>
{/each}