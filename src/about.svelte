<script>
import {urlqrcode} from './urlqrcode.js'
import {advancemode,newbie,showpunc} from './store.js'

import Switch from './3rd/switch.svelte';
</script>

<div class="toctext">
版本：2023.7.15 <Switch bind:value={$advancemode} label="專業模式" design="slider" />
{#if $advancemode=='on'}
本圖文對照數據庫主要基於以下素材：
<br/>永樂南北藏(山東省圖書館)、金剛經集註(朱棣)、梵文原典(<a target=_new href="https://www.dsbcproject.org/">DSBC</a>, <a target=_new href="https://ancient-buddhist-texts.net">Ancient Buddhist Texts</a>)、
經文新式標點(CBETA)、梵漢佛經對勘叢書（社會科學出版社）、維基百科及各種佛學詞典之詞條。
<br/>授權方式：<a href="https://creativecommons.org/publicdomain/zero/1.0/deed.zh">Creative Common Zero</a>。
<br/>數字加工：按手機比例裁圖及修圖、文字與圖片逐行對齊、原文及各種譯本逐句對齊、誦經影片時間軸。
<Switch bind:value={$showpunc} label="顯示標點符號" design="slider" fontSize="24"/>
<Switch bind:value={$newbie} label="啟用時顯示歡迎畫面" design="slider" fontSize="24"/>

{:else}
到LINE搜尋ID @dharmacloud，或加入<a href="https://lin.ee/1tmTKXi">官方帳號</a>，獲得更新訊息。
<a target="_new" href="https://dharmacloud.github.io/">官方網站</a>

<div class="center">{@html urlqrcode}</div>
{/if}
</div>

