<script>
import { onDestroy } from "svelte";
import Switch from "./3rd/switch.svelte";
import {APPVER, newbie} from './store.js'
let value=$newbie;
export let closePopup;
onDestroy(()=>{
    newbie.set(value)
});
</script>
<div class="popup">
<div class="bodytext">
<span class="welcome">永樂藏 {APPVER}</span>
<br/>全屏模式安裝步驟
<br/>安卓：右上角⋮ →安裝應用程式
<br/>iOS：分享→加到主畫面
<hr/>
不會收集個人資訊
<br/>自行承擔使用本軟件的任何結果
<br/><button style="font-size:150%;width:100%" on:click={closePopup}>同意</button>
<Switch bind:value label="啟用時顯示此畫面" design="slider" fontSize="24"/>
</div>
</div>