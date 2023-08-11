<script>
import {newbie,showpunc,showsponsor} from './store.js'
import Switch from './3rd/switch.svelte';
import Sponsoring from './sponsoring.svelte';
import HOF from './hof.svelte'
import Workers from './workers.svelte'
import ProjectIntro from './project.svelte'
let show=0;
const toggleshowsponsoring=()=>show=show==1?0:1;
const toggleshowdonors=()=>show=show==2?0:2;
const toggleshowworkers=()=>show=show==3?0:3;
const toggleshowproject=()=>show=show==4?0:4;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="tabs">
<span class="clickable" 
class:selected={show==1} on:click={toggleshowsponsoring}>支持我們</span>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<span class:selected={show==2}  class="clickable" on:click={toggleshowdonors}>功德芳名</span>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<span class:selected={show==3}  class="clickable" on:click={toggleshowworkers}>工作人員</span>
<!-- svelte-ignore a11y-click-events-have-key-events -->
{#if $showpunc!=='on'}
<span class:selected={show==4}  class="clickable" on:click={toggleshowproject}>項目概要</span>
{/if}
</div>
<div class="toctext">
{#if show==1}
<Sponsoring/>
{:else if show==2}
<HOF/>
{:else if show==3}
<Workers/>
{:else if show==4 && $showpunc!=='on'}
<ProjectIntro/>
{:else}
永樂藏 版本 2023.8.11
<br/>請加入Line <a href="https://lin.ee/1tmTKXi">官方帳號</a>@dharmacloud
<br/>程序問題回報:Sukhanika (WeChat, GMail)
<hr/>
<Switch bind:value={$showpunc} label="顯示標點符號" design="slider" fontSize="24"/>
<Switch bind:value={$showsponsor} label="靜置時顯示功德芳名" design="slider" fontSize="24"/>
<Switch bind:value={$newbie} label="啟動時顯示歡迎畫面" design="slider" fontSize="24"/>
<hr/>
本圖文對照數據庫主要基於以下素材：
<br/>永樂南北藏(山東省圖書館)、金剛經集註(朱棣)、梵文原典(<a target=_new href="https://www.dsbcproject.org/">Digital Sanskrit Buddhist Canon</a>, <a target=_new href="https://ancient-buddhist-texts.net">Ancient Buddhist Texts</a>)、
經文及新式標點(CBETA)、梵漢佛經對勘叢書（黃寶生，中國社會科學出版社）、維基百科及數種佛學詞典之詞條、Youtube 公開影片。
<br/>數字加工：按手機比例裁圖及修圖、文字與圖片逐行對齊、原文及各種譯本逐句對齊、誦經與圖版同步時間軸。
<br/>授權方式：<a href="https://creativecommons.org/publicdomain/zero/1.0/deed.zh">Creative Common Zero</a>

<div class="endmarker">※※※</div>

{/if}
</div>