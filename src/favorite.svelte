<script>
import { fromObj } from 'ptk';
import {favorites,activefolioid,booknameOf} from './store.js'
import {goPb,loadFolio} from './nav.js'
let items=[],others=[];
export let ptk;
export let closePopup;
const loadfavorites=()=>{
    const _favorites=$favorites;
    const _others={};
    for (let key in _favorites) {
        if (key==$activefolioid) {
            const arr=_favorites[$activefolioid];
            for (let i=0;i<arr.length;i++) {
                if (arr[i]) {
                    items.push(i);
                }
            }
        } else {
            _others[key]=Object.keys(_favorites[key]).length;
        }
    }
    others=fromObj(_others,(a,b)=>[a,b]);
}
const gofavorite=(pb)=>{
    goPb(ptk,pb);
    closePopup();
}
const firstfavorite=(folioid)=>{
    const favors=$favorites[folioid]
    for (let i=0;i<favors.length;i++) {
        if (favors[i]) return i;
    }
}
const gootherfavorite=(folioid)=>{
    closePopup();
    loadFolio(folioid,()=>{
        const first=firstfavorite(folioid);
        goPb(ptk,first+1);
    });    
}

$: loadfavorites($favorites);
</script>

<div class="toctext">本卷♥第
{#each items as item}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<span class="favoriteitem" on:click={()=>gofavorite(item+1)}>{item+1}</span>
{/each}
折
</div>

<div class="toctext">他卷
{#each others as [folioid,count]}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<span on:click={()=>gootherfavorite(folioid)}>{booknameOf(folioid)}♥{count}個　</span>
{/each}


</div>
