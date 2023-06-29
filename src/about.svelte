<script>
import {urlqrcode} from './urlqrcode.js'
import {advancemode} from './store.js'
import Switch from './3rd/switch.svelte';
$: console.log($advancemode)
</script>

<div class="toctext">
<Switch bind:value={$advancemode} label="進階模式" design="slider" fontSize="4vh"/>
{#if $advancemode=='on'}
本產品基於以下公開素材：
<br/>永樂北藏(山東省圖書館)、金剛經集註(朱棣)、梵文校勘本(Edward Conze, DSBC)、經文新式標點(CBETA)。
分享方式<a href="https://creativecommons.org/publicdomain/zero/1.0/deed.zh">Creative Common Zero</a>
<br/>
<br/>這是<a href="https://github.com/dharmacloud" target="_new">開源</a>軟件(2023.6.24)，可以不受任何限制，以任何形態散佈本軟件。
{:else}
<br/>點擊加入我們的<a href="https://lin.ee/1tmTKXi">LINE官方帳號</a>或到 LINE 搜尋ID @dharmacloud，以獲得更新訊息。
<div class="qrcode">{@html urlqrcode}</div>
免費結緣網址<a target="_new" href="https://dharmacloud.github.io/">dharmacloud.github.io</a>
{/if}

</div>
<style>
.qrcode {width:100%;
    position: relative;
    display: flex;
    justify-content: center;
}
</style>