<script>
import {youtubeid, player,activebookid, findByYoutube} from './store.js';
// import {mediaurls} from './mediaurls.js'
import Slider from './3rd/slider.svelte';
export let ptk;
const selectmedia=e=>{
    youtubeid.set(e.target.selectedOptions[0].attributes.value.nodeValue||'');
}
const silence={youtube:'',performer:'-靜默-'};
let mediaurls=[silence]
const humanDuration=(t)=>{
    if (!t) return ''
    const minutes=Math.floor(t/60);
    const seconds=t - minutes*60;
    return `${minutes}:${seconds}`;
}
const getDuration=id=>{
    const timestamps=findByYoutube(id)?.timestamp;
    if (!timestamps) return 0;
    return timestamps[timestamps.length-1]-timestamps[0];
}
const updateAudioList=(activeid)=>{
    const ts=ptk.columns.timestamp;
    mediaurls=[silence]
    for (let i=0;i<ts.keys.len();i++) {
        const youtube=ts.keys.get(i);
        const performer=ts.performer[i];
        const timestamp=ts.timestamp[i];
        const bookid=ts.bookid[i]
        activeid==bookid&&mediaurls.push( {youtube,performer,bookid,timestamp});
    }
    console.log(mediaurls)
};
$: updateAudioList($activebookid)
</script>
<div class="toctext">
{#if !$player}
Youtube 播放器載入中
{:else}
{#if $youtubeid==''}
按「--靜默--」選擇唱頌，再按右上角 ╳。
{:else}
按下拉選單，選「-靜默-」停止播放。
到Youtube觀看<a target=_new href={"https://www.youtube.com/watch?v="+$youtubeid}>原始影片</a>。
{/if}
聲音直接抽取自Youtube公開影片，若該影片已下架，或者禁止嵌用則無法於此播放。
<select on:change={selectmedia}>
{#each mediaurls as media}
<option class="option" value={media.youtube} selected={media.youtube==$youtubeid}>{media.performer}</option>
{/each}
</select>

{#if $youtubeid}
<!-- svelte-ignore missing-declaration -->
<br/>時長：{humanDuration(getDuration($youtubeid))}
循環播放次數：<Slider value=1 min=0 max=10/>
{/if}
{/if}
</div>