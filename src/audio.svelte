<script>
import {videoid, player,activebookid, findByVideoId, remainrollback,videohost} from './store.js';
import Slider from './3rd/rangeslider.svelte';
import {usePtk,parseOfftext,} from 'ptk'
import { onDestroy, onMount } from 'svelte';
import { get } from 'svelte/store';
export let ptk;
let value=[ $remainrollback,0];
let subtitles=[], subtitles2=[], subtitle='',subtitle2='',subtitletimer, nsub=0;
onDestroy(()=>{
    clearInterval(subtitletimer);
});
const selectmedia=e=>{
    if (get(remainrollback)==0) remainrollback.set(-1);
    videoid.set(e.target.selectedOptions[0].attributes.value.nodeValue||'');
}
const silence={vid:'',performer:'-靜默-'};
let mediaurls=[silence]
const humanDuration=(t)=>{
    if (!t) return ''
    const minutes=Math.floor(t/60);
    const seconds=t - minutes*60;
    return `${minutes}:${seconds}`;
}
const getDuration=id=>{
    const timestamps=findByVideoId(id)?.timestamp;
    if (!timestamps) return 0;
    return timestamps[timestamps.length-1]-timestamps[0];
}
const updateAudioList=(activeid)=>{
    const ts=ptk.columns.timestamp;
    mediaurls=[silence]
    const vhost=$videohost;
    for (let i=0;i<ts.keys.len();i++) {
        const vid=ts.keys.get(i);
        const vh=ts.videohost[i];
        const performer=ts.performer[i];
        const timestamp=ts.timestamp[i];
        const bookid=ts.bookid[i]
        if (vh==vhost) {
            activeid==bookid&&mediaurls.push( {vid,performer,bookid,timestamp});
        }
    }
};
let timestamp=[];
onMount(()=>{
    subtitletimer=setInterval(()=>{
        const playertime=get(player)?.getCurrentTime();
        while (playertime>=timestamp[nsub] && nsub<timestamp.length) {
            subtitle=subtitles[nsub]||subtitle||''; //do not update empty line
            subtitle2=subtitles2[nsub]||subtitle2||''; //do not update empty line
            nsub++;
        }
        if (nsub>=timestamp.length) nsub=0;
    },500);
});

const loadSubtitle=async id=>{
    subtitle2=subtitle='';
    subtitles2=[],subtitles=[];
    if (!id) return;
    timestamp=findByVideoId(id,'timestamp_sanskrit')?.timestamp||[];
    if (!timestamp?.length) return;
    const skptk=usePtk('dc_sanskrit');   
    subtitles2=await skptk.fetchAddress('bk#'+$activebookid);
    subtitles=await ptk.fetchAddress('bk#'+$activebookid);
    nsub=0;
}
const htmltext=s=>{
    return parseOfftext(s)[0].replace(/[【《〔](.+?)[】》〕]/g,'<span class=bracket>$1 </span>');
}
$: loadSubtitle($videoid);
$: updateAudioList($activebookid)
const setRemain=()=>{
    const v=value[0];
    if ( (v&&get(remainrollback)==value[0]) || 
    (v==0 && get(remainrollback)==-1) )  return;
    if (v==0) {
        remainrollback.set(-1) ; //infinite
    } else {
        remainrollback.set(v)
    }
}
const humanStoptime=t=>{
    if (!t) return '';
    return (new Date(Date.now()+t*1000)).toLocaleTimeString()+'停止';
}
</script>
<div class="toctext">
{#if !$player}
{$videohost} 播放器載入中
{:else}
{#if $videoid==''}
按「--靜默--」選擇唱頌，再按右上角✖️。開頭可能有廣告聲。
<br/>聲音直接抽取自{$videohost}公開影片，若該影片已下架，或者禁止嵌用則無法於此播放。
{:else}

{#if videohost=='youtube'}
觀看<a target=_new href={"https://www.youtube.com/watch?v="+$videoid}>原始影片</a>。
{:else}
觀看<a target=_new href={"https://v.qq.com/x/page/"+$videoid+".html"}>原始影片</a>。
{/if}


{/if}
<br/><select on:change={selectmedia}>
{#each mediaurls as media}
<option class="option" value={media.vid} selected={media.vid==$videoid}>{media.performer}</option>
{/each}
</select>

{#if $videoid}
<!-- svelte-ignore missing-declaration -->
<br/>音頻長度：{humanDuration(getDuration($videoid))}
<br/>重播次數：{value[0]||'無限'}
{#if value[0]>0} { humanStoptime(value[0]*getDuration($videoid))}{/if}
<Slider on:input={setRemain} bind:value min=0 max=10/>
<hr/>
<div class="subtitle">{@html htmltext(subtitle2)}</div>
<div class="subtitle">{@html htmltext(subtitle)}</div>

{/if}
{/if}
</div>