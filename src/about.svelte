<script>
import {newbie,showyoutube,showpunc,showsponsor,vip,heightratio,tosim, textsize} from './store.js'
import {_} from './textout.js'
import Switch from './3rd/switch.svelte';
//import Sponsoring from './sponsoring.svelte';
import HOF from './hof.svelte'
import Workers from './workers.svelte'
import ProjectIntro from './project.svelte'
import StyleIntro from './styleintro.svelte'
import Materials from './materials.svelte'
import { githubicon } from './icons.js';
import Slider from './3rd/rangeslider.svelte';
import {debounce} from 'ptk'
import { documentHeight } from './fullscreen.js';
import CheckUpdate from './checkupdate.svelte';
import StateBtn from './comps/statebutton.svelte'
import Endmarker from './endmarker.svelte';
import {APPVER} from './constant.js'
import { getVip } from './vip.js';
let show=0,vipcode=$vip;
let hratio=[ Math.floor((($heightratio*100)-90)*10) ,0]; 
let textsz=[ $textsize ,0];
const toggleshowsponsoring=()=>show=show==1?0:1;
const toggleshowdonors=()=>show=show==2?0:2;
const toggleshowworkers=()=>show=show==3?0:3;
const toggleshowmaterials=()=>show=show==4?0:4; 
const toggleshowstyle=()=>show=show==6?0:6;
const toggleshowproject=()=>show=show==5?0:5;
/*
const clearCache=async (ext)=>{
    const cache=await caches.open(CacheName);
    let keys=await cache.keys();
    keys=keys.filter(it=>!ext || it.url.endsWith(ext));
    clearcount=keys.length;
    keys.forEach(key=>cache.delete(key))
}*/
const setRatio=e=>{
    const j=((e.detail[0]||100));
    heightratio.set( (j/10 + 90)/100 );
    documentHeight();
}
const setTextsize=e=>{
    const j=((e.detail[0]||100));
    textsize.set(j);
}
let timer=0;
const onkeyup=(e)=>{
    const ele=e.target;
    const start = ele.selectionStart;
    const  end = ele.selectionEnd;
    ele.value = ele.value.toUpperCase().replace(/[^a-zA-Z\d]/g,'');
    ele.setSelectionRange(start, end);
    clearTimeout(timer)
    timer=setTimeout(()=>{
        vip.set(ele.value);
    },1000);
}
</script>
<div class="tabs">
{#key $tosim}
<span aria-hidden="true" class="clickable" 
class:selected={show==1} on:click={toggleshowsponsoring}>{_("護持")}</span>
<span aria-hidden="true" class:selected={show==2}  class="clickable" on:click={toggleshowdonors}>芳名</span>
<!--<span aria-hidden="true" class:selected={show==3}  class="clickable" on:click={toggleshowworkers}>伙伴</span>-->
<span aria-hidden="true" class:selected={show==4}  class="clickable" on:click={toggleshowmaterials}>素材</span>
{#if $vip && getVip("title")}
<span aria-hidden="true" class:selected={show==6}  class="clickable" on:click={toggleshowstyle}>{_("項目")}</span>
{:else}
<span aria-hidden="true" class:selected={show==5}  class="clickable" on:click={toggleshowproject}>{_("關於")}</span>
{/if}
{/key}
</div>
<div class="bodytext">
{#if show==1}
<!--<Sponsoring/>-->
{:else if show==2}
<HOF/>
{:else if show==3}
<Workers/>
{:else if show==4}
<Materials/>
{:else if show==5}
<StyleIntro/>
{:else if show==6}
<ProjectIntro/>
{:else}

<span class="logotitle">{_("永樂藏",$tosim)}</span>
<CheckUpdate/>
{#key $tosim}
<br/>{_("漢字顯示")}：<StateBtn states={{0:"原貌",1:_("简體（「乾後發」等不變）"),2:"简体"}} storeid={tosim}/>
<br/>版本 {APPVER}{getVip('title',$vip)||($vip?_("查無此碼"):"")}
<br/>{_("VIP碼")}<input 
placeholder={_("沒有也可正常使用")} size=12 type="text" on:keyup={onkeyup} bind:value={vipcode}/>
<br/>微信 Sukhanika
<br/><a href="mailto:dharmacloudpublishing@gmail.com">dharmacloudpublishing[at]gmail</a>
<br/>LINE官號<a href="https://lin.ee/1tmTKXi" target=_new>@dharmacloud</a>
<br/>{_("點焦點文字（紅色背景）分享")}
{/key}
<hr/>
<Slider bind:value={textsz} on:input={debounce(setTextsize,300)} max={250} min={80} >
    <span slot="caption"　style="float:right">{textsz[0]}% {_("字體大小",$tosim)}</span>
</Slider>
<br/>{_("看不到圖版最底下的行才需要調整",$tosim)}
<Slider bind:value={hratio} on:input={debounce(setRatio,300)} max={100} min={1} >
<span slot="caption" style="float:right">{hratio[0]}% 全屏高度</span>
</Slider>
<br/>
{#key $tosim}
<Switch bind:value={$showpunc} label={_("顯示標點符號")} design="slider" />
<Switch bind:value={$showsponsor} label={_("靜置時顯示施主")} design="slider" />
<Switch bind:value={$showyoutube} label={_("顯示油管影片連結")} design="slider" />
<Switch bind:value={$newbie} label={_("啟動時顯示歡迎畫面")} design="slider" />
{/key}

<Endmarker/>

{/if}
</div>
