<script>
import {online,player,audioid,activefolioid, playnextjuan, findByAudioId,playrate,activePtk,
     remainrollback,selectmedia,mediaurls, stopAudio, playing, showyoutube} from './store.js';
import {CacheName} from './constant.js'
import Slider from './3rd/rangeslider.svelte';
import Switch from './3rd/switch.svelte';
import {usePtk,parseOfftext, sleep,debounce} from 'ptk'
import { onDestroy, onMount } from 'svelte';
import { get } from 'svelte/store';
import {audiofolder,fetchAudioList} from './mediaurls.js'
import {allJuan} from './nav.js'
import {downloadicon,youtubeicon} from './icons.js'
import { downloadToCache } from 'ptk/platform/downloader.js';
import {_} from './textout.js'
import Endmarker from './endmarker.svelte';
$: ptk = usePtk($activePtk);
let rate=[$playrate||100,0];
let value=[ $remainrollback,0] ;
let subtitles=[], subtitles2=[], subtitle='',subtitle2='',subtitletimer, nsub=0;
onDestroy(()=>{
    clearInterval(subtitletimer);
});

const humanDuration=(t)=>{
    if (!t) return ''
    const minutes=Math.floor(t/60);
    const seconds=t - minutes*60;
    return `${minutes}:${seconds}`;
}
const getDuration=id=>{
    const timestamps=findByAudioId(id)?.timestamp;
    if (!timestamps) return 0;
    return timestamps[timestamps.length-1]-timestamps[0];
}
let timestamp=[];
onMount(()=>{
    subtitletimer=setInterval(()=>{
        if (!$audioid) return;
        // const plyr=player($audioid);
        // if (!plyr)return;
        const playertime=player.currentTime

        // const playertime=plyr.getCurrentTime&&plyr.getCurrentTime();
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
    timestamp=findByAudioId(id,'timestamp_sanskrit')?.timestamp||[];
    
    if (!timestamp?.length) return;
    const skptk=usePtk('dc_sanskrit');   
    subtitles2=await skptk.fetchAddress('bk#'+$activefolioid);
    subtitles=await ptk.fetchAddress('bk#'+$activefolioid);
    nsub=0;
}
const htmltext=s=>{
    return parseOfftext(s)[0].replace(/[【《〔](.+?)[】》〕]/g,'<span class=bracket>$1 </span>');
}
let downloading='',progress='';
const downloadit=async (aid)=>{
    downloading=aid;
    await downloadToCache(CacheName,audiofolder+aid+'.mp3',msg=>{
        progress=msg;
    });
    await sleep(1000); //wait for cache to sync
    const list=await fetchAudioList($activefolioid,mediaurls,$showyoutube=='on');
    mediaurls.set(list);
    downloading='';
    progress='';
}
$: loadSubtitle($audioid);

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
    if (!t || ($playnextjuan=='on'&&allJuan(ptk).length>1 ) ) return '';
    return (new Date(Date.now()+t*1000)).toLocaleTimeString()+'停止';
}
const goyoutube=id=>{
    stopAudio();
    window.open("https://youtube.com/watch?v="+id,"_blank");
}
const setPlayrate=e=>{
    const rate=e.detail[0];
    player.playbackRate=rate/100;
    playrate.set(rate)
}
const speed1x=()=>{
    rate=[100,0];
    player.playbackRate=1;
    playrate.set(100)
}
</script>
<div class="bodytext">

{#each $mediaurls as media,idx}

<!-- {#if idx&& !$playing && media.youtube}
<span aria-hidden="true" on:click={goyoutube(media.youtube)}>{@html youtubeicon}</span>
{/if} -->

{#if media.incache || !media.aid}
<span aria-hidden="true" class="clickable" on:click={()=>!downloading&&selectmedia(media.aid,true)} 
class:selected={media.aid==$audioid}>{_(media.performer)}{idx&&media.aid==$audioid?'♫':''}</span>
    <br/>
{:else}
{#if $online}
<span class="uncache">{_(media.performer)+" "}</span><span aria-hidden="true" class="clickable" on:click={()=>!downloading&&downloadit(media.aid)}>{@html downloadicon}{_("下載")}</span>
{#if downloading==media.aid}{progress}{/if}
{#if $audioid==media.vid&& $audioid}{humanDuration(getDuration($audioid))}{/if}
<br/>
{/if}
{/if}
{/each}


<!-- svelte-ignore missing-declaration -->
<br/>
<Slider bind:value={rate} on:input={debounce(setPlayrate,300)} max={300} min={30} >
    <span slot="caption"　style="float:right">{(rate[0]/100)+_(" 播放速度")}</span>
</Slider>

<br/>
{#if rate[0]!==100}
<span aria-hidden="true" class="clickable" on:click={speed1x}>{_("恢復正常速度")}</span>{/if}
{_('重播次數')}：{value[0]>0?value[0]:_('無限')}
{#if value[0]>0} { humanStoptime(value[0]*getDuration($audioid))}{/if}
<Slider on:input={setRemain} bind:value min=0 max=10/>
{#if ptk&&allJuan(ptk).length>1}
<Switch label={_('自動播放下一卷')} design="slider"  bind:value={$playnextjuan}></Switch>
{/if}

<hr/>
<div class="subtitle">{@html _(htmltext(subtitle2))}</div>
<div class="subtitle">{@html _(htmltext(subtitle))}</div>

<Endmarker/>
</div>
