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
<span class="welcome">歡迎</span>
<br/>安裝到桌面後可以全螢幕顯示，步驟：
<br/>Android:使用Chrome，右上角功能表→安裝應用程式
<br/>iOS:使用Safari，分享→加到主畫面
<br/>左右滑動翻頁，點畫面任何一處，調出功能表。
<br/>⏵隨機播放  ♡加到書籤
<div style="color:white;background:var(--menubar-color)">⚙️設置📓經卷🧭導引
<br/>❤️書籤🎵誦經🔎詞典
<br/>進階:📜原文🔀異譯📚集註</div>
<br/>不會主動收集個人資訊。若造成用戶任何損失，既不負責。
<br/><button style="font-size:150%" class="center" on:click={closePopup}>同意</button>
<Switch bind:value label="啟動時顯示此畫面" design="slider" fontSize="24"/>
</div>
</div>