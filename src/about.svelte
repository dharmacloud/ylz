<script>
import {newbie,showyoutube,showpunc,showsponsor} from './store.js'
import Switch from './3rd/switch.svelte';
import Sponsoring from './sponsoring.svelte';
import HOF from './hof.svelte'
import Workers from './workers.svelte'
import ProjectIntro from './project.svelte'
import Materials from './materials.svelte'
import { githubicon,appqrcode } from './icons.js';
import {Cachesname} from './constant.js'


let show=0,clearcount=-1;
const toggleshowsponsoring=()=>show=show==1?0:1;
const toggleshowdonors=()=>show=show==2?0:2;
const toggleshowworkers=()=>show=show==3?0:3;
const toggleshowmaterials=()=>show=show==4?0:4;
const toggleshowproject=()=>show=show==5?0:5;

const clearCache=async (ext)=>{
    const cache=await caches.open(Cachesname);
    let keys=await cache.keys();
    keys=keys.filter(it=>!ext || it.url.endsWith(ext));
    clearcount=keys.length;
    keys.forEach(key=>cache.delete(key))
}

</script>

<div class="tabs">
<!-- svelte-ignore a11y-click-events-have-key-events -->
<span class="clickable" 
class:selected={show==1} on:click={toggleshowsponsoring}>護持</span>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<span class:selected={show==2}  class="clickable" on:click={toggleshowdonors}>芳名</span>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<span class:selected={show==4}  class="clickable" on:click={toggleshowmaterials}>素材</span>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<span class:selected={show==3}  class="clickable" on:click={toggleshowworkers}>伙伴</span>
{#if $showpunc!=='on'}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<span class:selected={show==5}  class="clickable" on:click={toggleshowproject}>項目</span>
{/if}


</div>
<div class="toctext">
{#if show==1}
<Sponsoring/>
{:else if show==2}
<HOF/>
{:else if show==3}
<Workers/>
{:else if show==4}
<Materials/>
{:else if show==5 && $showpunc!=='on'}
<ProjectIntro/>
{:else}
<span class="logotitle">永樂藏 2023.8.16</span>
<br/>Line <a href="https://lin.ee/1tmTKXi">官號</a>@dharmacloud
<br/>WeChat: Sukhanika
<br/>源代碼<a href="https://github.com/dharmacloud/swipegallery/" target=_new>{@html githubicon}</a>
，所有成果若無特別聲明一律採用
<br/><a target=_new href="https://creativecommons.org/publicdomain/zero/1.0/deed.zh">CC0 1.0 通用公共领域贡献</a>
<div class="endmarker">分享此APP</div>
<span>{@html appqrcode}</span>
<hr/>
<Switch bind:value={$showpunc} label="顯示標點符號" design="slider" fontSize="24"/>
<Switch bind:value={$newbie} label="啟動時顯示歡迎畫面" design="slider" fontSize="24"/>
<Switch bind:value={$showsponsor} label="靜置時顯示功德芳名" design="slider" fontSize="24"/>
<Switch bind:value={$showyoutube} label="顯示油管原始影片連結" design="slider" fontSize="24"/>

{#if $showpunc=='off'}
{#if clearcount>-1}已清除{clearcount}
{:else}
<span class="danger">清除</span>
{/if}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<span class="clickable" on:click={()=>clearCache(".ptk")}>數據庫</span>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<span class="clickable" on:click={()=>clearCache(".mp3")}>音頻</span>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<span class="clickable" on:click={()=>clearCache(".zip")}>圖檔</span>
{/if}
<div class="endmarker">※※※</div>

{/if}
</div>
<style>
.danger {background:red;color:yellow}
</style>