<script>
import {urlqrcode} from './urlqrcode.js'
import {advancemode,videohost} from './store.js'
import Switch from './3rd/switch.svelte';

</script>

<div class="toctext">
<br/>
<Switch bind:value={$advancemode} label="進階模式" design="slider" />
{#if $advancemode=='on'}
本數據庫基於以下公開素材：
永樂北藏(山東省圖書館)、金剛經集註(朱棣)、梵文校勘本(Edward Conze, ancient-buddhist-texts.net)、
經文新式標點(CBETA)。
<br/>並以<a href="https://creativecommons.org/publicdomain/zero/1.0/deed.zh">Creative Common Zero</a>分享。
<br/>更新程式前，先清除瀏覽器快取。
<br/>這是<a href="https://github.com/dharmacloud/" target="_new">開源</a>軟件(2023.7.6)，
允許以任何形態散佈本軟件。
{:else}
<Switch bind:value={$videohost} label="視頻來源" options={["qq","youtube"]} design="multi" />
<br/>到LINE搜尋ID @dharmacloud，或加入<a href="https://lin.ee/1tmTKXi">官方帳號</a>，獲得更新訊息。
結緣品<a target="_new" href="https://dharmacloud.github.io/">dharmacloud.github.io</a>
<div class="center">{@html urlqrcode}</div>
{/if}
</div>

