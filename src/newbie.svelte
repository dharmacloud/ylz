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
<br/>{_("僅供非佛學專業人士使用")}
<br/>{_("漢字顯示")}：<StateBtn states={{0:"原貌",1:_("简體（「乾後發」等不變）"),2:"简体"}} storeid={tosim}/>
<br/>{_("全屏模式安裝步驟")}
<br/>{_("安卓：添加到桌面")}
<br/>{_("Vivo：先收藏書籤，編輯收藏，保存到手機桌面")}
<br/>{_("iOS：加到主畫面")}
<hr/>
{_("本軟件不會主動收集個人資訊")}
<br/>{_("接受使用本軟件產生的任何結果")}
<br/><button style="font-size:150%;width:100%" on:click={closePopup}>同意</button>
<Switch bind:value label={_("啟用時再度顯示此畫面")} design="slider" />
{/key}
</div>

</div>