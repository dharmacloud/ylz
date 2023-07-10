<script>
import {urlqrcode} from './urlqrcode.js'
import {advancemode} from './store.js'
import Switch from './3rd/switch.svelte';
</script>

<div class="toctext">
版本：2023.7.10 <Switch bind:value={$advancemode} label="進階模式" design="slider" />
{#if $advancemode=='on'}
本數據庫基於以下公開素材：
永樂南北藏(山東省圖書館)、金剛經集註(朱棣)、梵文校勘本(Edward Conze, <a target=_new href="https://ancient-buddhist-texts.net">Ancient Buddhist Texts</a>)、
經文新式標點(CBETA)。
<br/>授權方式：<a href="https://creativecommons.org/publicdomain/zero/1.0/deed.zh">Creative Common Zero</a>。
<br/>更新程式前，先清除瀏覽器快取。
<br/>這是<a href="https://github.com/dharmacloud/" target="_new">開源</a>軟件，
允許以任何形態散佈本軟件。
{:else}
到LINE搜尋ID @dharmacloud，或加入<a href="https://lin.ee/1tmTKXi">官方帳號</a>，獲得更新訊息。
結緣品<a target="_new" href="https://dharmacloud.github.io/">dharmacloud.github.io</a>
<div class="center">{@html urlqrcode}</div>
{/if}
</div>

