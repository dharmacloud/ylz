<script>
import { onDestroy } from "svelte";
import Switch from "./3rd/switch.svelte";
import {newbie} from './store.js'
let value=$newbie;
export let closePopup;
onDestroy(()=>{
    newbie.set(value)
});
</script>
<div class="popup">
<div class="toctext">
<span class="welcome">永樂藏</span>
<br/>安裝桌面可以全螢幕顯示，步驟：
<br/>Android:使用Chrome，右上角功能表→安裝應用程式
<br/>iOS:Safari，分享→加到主畫面
<br/>左右滑動翻頁、橫向或點任何一處顯示功能表。
<br/>♫誦經 再點一次停止。
<br/>♡書籤。書籤閃爍時點擊改變顏色，五秒後確定。不閃爍時再點取消。每一卷只能有一種顏色的書籤。
<br/>這是可以自由分享的結緣品，不會收集個人資訊，使用本軟件所產生的任何結果請自行承擔。
<br/><button style="font-size:150%;width:100%" on:click={closePopup}>同意</button>
<Switch bind:value label="啟用時顯示此畫面" design="slider" fontSize="24"/>
</div>
</div>