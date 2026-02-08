<script>
import { fromObj } from 'ptk';
import {favorites,activefolioid,booknameOf} from './store.js'
import {goPb,loadFolio} from './nav.js'
let items=[],others=[];

export let closePopup;
const loadfavorites=()=>{
    const _favorites=$favorites;
    const _others={};
    for (let key in _favorites) {
        if (key==$activefolioid) {
            const obj=_favorites[$activefolioid];
            for (let i in obj) {               
                if (obj[i]) items.push(parseInt(i));
            }
        } else {
            _others[key]=Object.keys(_favorites[key]).length;
            
        }
    }   
    others=fromObj(_others,(a,b)=>[a,b]);
}
const gofavorite=(pb)=>{
    goPb(pb);
    closePopup();
}
const firstfavorite=(folioid)=>{
    const favors=$favorites[folioid]
    let first=-1;
    for (let i in favors) {
        if (parseInt(i)>first) first=parseInt(i);
    }
    return first;
}
const gootherfavorite=(folioid)=>{
    closePopup();
    loadFolio(folioid,()=>{
        const first=firstfavorite(folioid);
        goPb((first||0)+1);
    });    
}

$: loadfavorites($favorites);
</script>

{#if items.length}
<div class="bodytext">本卷♥第
{#each items as item}
<span aria-hidden="true" class="favoriteitem" on:click={()=>gofavorite(item+1)}>{item+1}</span>
{/each}
折
</div>
{:else}
本卷無書籤。點右上角 ♡ 加入書籤
{/if}
<hr/>
{#if others.length}
<div class="bodytext">
{#each others as [folioid,count]}
<span aria-hidden="true" on:click={()=>gootherfavorite(folioid)}>{booknameOf(folioid)}♥{count}個　</span>
{/each}
</div>
{/if}


