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
const selectmedia=vid=>{
    if (get(remainrollback)==0) remainrollback.set(-1);
    videoid.set(vid||'');
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
        const plyr=get(player);
        if (!plyr)return;
        const playertime=plyr.getCurrentTime&&plyr.getCurrentTime();
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

{#each mediaurls as media}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<span class="clickable" on:click={selectmedia(media.vid)} class:selected={media.vid==$videoid}>{media.performer}</span>

{#if $videoid==media.vid&& $videoid}
{#if videohost=='youtube'}
<a target=_new href={"https://www.youtube.com/watch?v="+$videoid}>原始影片</a>
{:else}
<a target=_new href={"https://v.qq.com/x/page/"+$videoid+".html"}>原始影片</a>
{/if}
{humanDuration(getDuration($videoid))}
{/if}
<br/>
{/each}

{#if $videoid==''}
<br/>聲音直接抽取自{$videohost}公開影片，若該影片已下架，或者禁止嵌用則無法於此播放。
{:else}

<!-- svelte-ignore missing-declaration -->
<br/>重播次數：{value[0]||'無限'}
{#if value[0]>0} { humanStoptime(value[0]*getDuration($videoid))}{/if}
<Slider on:input={setRemain} bind:value min=0 max=10/>
<hr/>
<div class="subtitle">{@html htmltext(subtitle2)}</div>
<div class="subtitle">{@html htmltext(subtitle)}</div>

{/if}


{/if}
</div>