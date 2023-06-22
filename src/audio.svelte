<script>
import {mediaid, player,activebookid} from './store.js';
import {mediaurls} from './mediaurls.js'
const selectmedia=e=>{
    mediaid.set(parseInt(e.target.selectedOptions[0].attributes.value.nodeValue)||0);
}
const humanDuration=(t)=>{
    if (!t) return ''
    const minutes=Math.floor(t/60);
    const seconds=t - minutes*60;
    return `${minutes}:${seconds}`;
}
</script>
<div class="toctext">
{#if !$player}
Youtube播放器載入中
{:else}
選唱頌者，背景播放並自動翻頁，
點 <a href={"https://www.youtube.com/watch?v="+mediaurls[$mediaid].youtube}>Youtube</a> 觀看原始影片。

<select on:change={selectmedia}>
{#each mediaurls as media,idx}
{#if media.bookid==$activebookid || idx==0}
<option class="option" value={idx} selected={idx==$mediaid}>{media.author}</option>
{/if}
{/each}
</select>

{#if $mediaid}
<!-- svelte-ignore missing-declaration -->
<br/>播放時長：{humanDuration(mediaurls[$mediaid].end-mediaurls[$mediaid].start)} 
{/if}
{/if}
</div>