<script>
import { onDestroy } from "svelte";
import Switch from "./3rd/switch.svelte";
import {newbie,tosim} from './store.js'
import {APPVER} from './constant.js'
import StateBtn from "./comps/statebutton.svelte";
import {_} from './textout.js'
let value=$newbie;
export let closePopup;
onDestroy(()=>{
    newbie.set(value)
});
</script>
<div class="popup">
<div class="bodytext">
{#key $tosim}
<span class="welcome">{_("永樂藏")} {APPVER}</span>
<br/>{_("漢字顯示")}：<StateBtn states={{0:"原貌",1:_("简體（「乾後發」等不變）"),2:"简体"}} storeid={tosim}/>
<br/>{_("苹果：加到主畫面")}。
<br/>{_("安卓：添加到桌面")}
<br/>{_("Vivo：先收藏書籤→編輯收藏→保存到桌面")}
<br/><Switch bind:value label={_("啟用時再度顯示此畫面")} design="slider" />
<button style="font-size:100%;align:center" on:click={closePopup}>{_("開始使用")}</button>
{/key}
</div>

</div>