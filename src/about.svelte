<script>
import {newbie,showyoutube,showpunc,showsponsor,activefolioid,heightratio, APPVER,textsize} from './store.js'
import Switch from './3rd/switch.svelte';
import Sponsoring from './sponsoring.svelte';
import HOF from './hof.svelte'
import Workers from './workers.svelte'
import ProjectIntro from './project.svelte'
import StyleIntro from './styleintro.svelte'
import Materials from './materials.svelte'
import { githubicon } from './icons.js';
import {CacheName} from './constant.js'
import Slider from './3rd/rangeslider.svelte';
import {debounce} from 'ptk'
import { documentHeight } from './fullscreen.js';
import CheckUpdate from './checkupdate.svelte';
let show=0,clearcount=-1;
let hratio=[ Math.floor((($heightratio*100)-90)*10) ,0]; 
let textsz=[ $textsize ,0];
const toggleshowsponsoring=()=>show=show==1?0:1;
const toggleshowdonors=()=>show=show==2?0:2;
const toggleshowworkers=()=>show=show==3?0:3;
const toggleshowmaterials=()=>show=show==4?0:4; 
const toggleshowstyle=()=>show=show==6?0:6;
const toggleshowproject=()=>show=show==5?0:5;

const clearCache=async (ext)=>{
    const cache=await caches.open(CacheName);
    let keys=await cache.keys();
    keys=keys.filter(it=>!ext || it.url.endsWith(ext));
    clearcount=keys.length;
    keys.forEach(key=>cache.delete(key))
}
const setRatio=e=>{
    const j=((e.detail[0]||100));
    heightratio.set( (j/10 + 90)/100 );
    documentHeight();
}
const setTextsize=e=>{
    const j=((e.detail[0]||100));
    textsize.set(j);
}
</script>

<div class="tabs">
<!-- svelte-ignore a11y-click-events-have-key-events -->
<span class="clickable" 
class:selected={show==1} on:click={toggleshowsponsoring}>護持</span>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<span class:selected={show==2}  class="clickable" on:click={toggleshowdonors}>檀越</span>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<span class:selected={show==3}  class="clickable" on:click={toggleshowworkers}>伙伴</span>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<span class:selected={show==4}  class="clickable" on:click={toggleshowmaterials}>素材</span>
<!-- svelte-ignore a11y-click-events-have-key-events -->
{#if $showpunc=='on'}
<span class:selected={show==5}  class="clickable" on:click={toggleshowproject}>關於</span>
{:else}
<span class:selected={show==6}  class="clickable" on:click={toggleshowstyle}>項目</span>
{/if}
</div>
<div class="bodytext">
{#if show==1}
<Sponsoring/>
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

<span class="logotitle">永樂藏</span>
<CheckUpdate/>
<br/>版本 <a href="https://github.com/dharmacloud/swipegallery/" target=_new>{APPVER}{@html githubicon}</a>
<br/>LINE官號<a href="https://lin.ee/1tmTKXi" target=_new>@dharmacloud</a>
<br/>微信 Sukhanika
<br/><a href="mailto:dharmacloudpublishing@gmail.com">dharmacloudpublishing[at]gmail</a>
<br/>點焦點文字（紅色背景）分享
<hr/>
<Slider bind:value={textsz} on:input={debounce(setTextsize,300)} max={250} min={80} >
    <span slot="caption"　style="float:right">{textsz[0]}% 字體大小</span>
</Slider>
<br/>看不到圖版最底下的行才需要調整
<Slider bind:value={hratio} on:input={debounce(setRatio,300)} max={100} min={1} >
<span slot="caption" style="float:right">{hratio[0]}% 全屏高度</span>
</Slider>
<br/>
<Switch bind:value={$showpunc} label="顯示標點符號" design="slider" fontSize="24"/>
<Switch bind:value={$showsponsor} label="靜置時顯示施主" design="slider" fontSize="24"/>
<Switch bind:value={$showyoutube} label="顯示油管影片連結" design="slider" fontSize="24"/>
<Switch bind:value={$newbie} label="啟動時顯示歡迎畫面" design="slider" fontSize="24"/>
{#if $showpunc=='off'}

{#if clearcount>-1}已清除{clearcount}
{:else}
<span class="danger">清除離線文件</span>
{/if}

<!-- svelte-ignore a11y-click-events-have-key-events -->
<span class="clickable" on:click={()=>clearCache(".ptk")}>數據庫</span>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<span class="clickable" on:click={()=>clearCache($activefolioid+".zip")}>本卷圖檔</span>
{/if}

<div class="endmarker">※※※</div>

{/if}
</div>
<style>
.danger {background:red;color:yellow}
</style>