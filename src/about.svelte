<script>
import {urlqrcode} from './urlqrcode.js'
import {advancemode} from './store.js'
import Switch from './3rd/switch.svelte';
</script>

<div class="toctext">
版本：2023.7.15 <Switch bind:value={$advancemode} label="進階模式" design="slider" />
{#if $advancemode=='on'}
本圖文對照數據庫主要基於以下素材：
<br/>永樂南北藏(山東省圖書館)、金剛經集註(朱棣)、梵文原典(<a target=_new href="https://www.dsbcproject.org/">DSBC</a>, <a target=_new href="https://ancient-buddhist-texts.net">Ancient Buddhist Texts</a>)、
經文新式標點(CBETA)、梵漢佛經對勘叢書（社會科學出版社）、維基百科及各種佛學詞典之詞條。
<br/>數字加工：按手機比例裁圖及修圖、文字與圖片逐行對齊、原文及各種譯本逐句對齊、誦經影片時間軸。
<br/>授權方式：<a href="https://creativecommons.org/publicdomain/zero/1.0/deed.zh">Creative Common Zero</a>。
<br/>這是<a href="https://github.com/dharmacloud/" target="_new">開源</a>軟件，可以任何形態散佈。
<br/>更新程式前，先清除瀏覽器快取。
{:else}
到LINE搜尋ID @dharmacloud，或加入<a href="https://lin.ee/1tmTKXi">官方帳號</a>，獲得更新訊息。
結緣品<a target="_new" href="https://dharmacloud.github.io/">dharmacloud.github.io</a>
<div class="center">{@html urlqrcode}</div>
{/if}
</div>

