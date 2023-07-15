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
<br/>安裝到桌面後可以全螢幕顯示，步驟：
<br/>Android:使用Chrome，右上角功能表→安裝應用程式
<br/>iOS:使用Safari，分享→加到主畫面
<br/>左右滑動翻頁，♪卷首起誦  ♡加入書籤，再點一次取消，點文字查字典，並顯示功能表。
<div style="color:white;background:var(--menubar-color)">⚙️設置📓經卷🧭導引
<br/>❤️書籤🎵誦經🔎詞典
</div>
<br/>這是可以自由分享的結緣品，不會收集個人資訊，使用本軟件所產生的任何結果請自行承擔。
<br/><button style="font-size:150%" class="center" on:click={closePopup}>同意</button>
<Switch bind:value label="啟用時顯示此畫面" design="slider" fontSize="24"/>
</div>
</div>