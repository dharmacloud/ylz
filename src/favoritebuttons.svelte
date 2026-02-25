<script>
import {favortypes,favorites, activepb} from './store.js';
import { loadFolio } from './nav.js';
export let folioid;
export let closePopup;
const updatefavors=()=>{
    const _favors=[];
    const _favorites=$favorites[folioid];
    for (let i in _favorites) {               
        if (_favorites[i]) _favors.push([ parseInt(i), _favorites[i]]);
    }
    return _favors;
}
const gofavor=(pb)=>{
    loadFolio(folioid,()=>{
        activepb.set(pb);
    });
    closePopup();
}
const favors=updatefavors($favorites)
</script>
{#each favors as [pb,favor]}
<span aria-hidden="true" on:click={()=>gofavor(pb)}>{favortypes[favor]}</span>
{/each}
