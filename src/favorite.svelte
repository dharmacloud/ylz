<script>
import { fromObj } from 'ptk';
import {favorites,activebookid,booknameOf, activefolio} from './store.js'
import {gofolio,loadBook} from './nav.js'
let items=[],others=[];
export let ptk;
export let closePopup;
const loadfavorites=()=>{
    const _favorites=$favorites;
    const _others={};
    for (let key in _favorites) {
        if (key==$activebookid) {
            const arr=_favorites[$activebookid];
            for (let i=0;i<arr.length;i++) {
                if (arr[i]) {
                    items.push(i);
                }
            }
        } else {
            _others[key]=_favorites[key].filter(it=>!!it).length;
        }
    }
    others=fromObj(_others,(a,b)=>[a,b]);
}
const gofavorite=(pb)=>{
    gofolio(ptk,pb);
    closePopup();
}
const firstfavorite=(bk)=>{
    const favors=$favorites[bk]
    for (let i=0;i<favors.length;i++) {
        if (favors[i]) return i;
    }
}
const gootherfavorite=(bk)=>{
    closePopup();
    loadBook(bk,()=>{
        const first=firstfavorite(bk);
        gofolio(ptk,first+1);
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
{#each others as [bk,count]}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<span on:click={()=>gootherfavorite(bk)}>{booknameOf(bk)}♥{count}個　</span>
{/each}


</div>
