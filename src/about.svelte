<script>
import {urlqrcode} from './urlqrcode.js'
import {advancemode,videohost} from './store.js'
import Switch from './3rd/switch.svelte';

</script>

<div class="toctext">
<br/>
<Switch bind:value={$advancemode} label="進階模式" design="slider"/>
<Switch bind:value={$videohost} label="視頻來源" options={["tencent","youtube"]} design="multi"/>
<br/>
{#if $advancemode=='on'}
本數據庫基於以下公開素材：
永樂北藏(山東省圖書館)、金剛經集註(朱棣)、梵文校勘本(Edward Conze, ancient-buddhist-texts.net)、經文新式標點(CBETA)、
。
<br/>並以<a href="https://creativecommons.org/publicdomain/zero/1.0/deed.zh">Creative Common Zero</a>分享。
<br/>
<br/>這是<a href="https://github.com/dharmacloud" target="_new">開源</a>軟件(2023.6.30)，可以不受任何限制，以任何形態散佈本軟件。
{:else}
到 LINE 搜尋ID @dharmacloud，或點擊加入<a href="https://lin.ee/1tmTKXi">官方帳號</a>，以獲得更新訊息
<div class="center">{@html urlqrcode}</div>
免費結緣網址<a target="_new" href="https://dharmacloud.github.io/">dharmacloud.github.io</a>
{/if}
</div>

