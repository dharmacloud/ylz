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
<br/>安裝到桌面以取得最佳顯示效果
<br/>Android:使用Chrome瀏覽器，按右上角功能表→「安裝應用程序」
<br/>iOS:按「分享」→「加到主畫面」
<br/>點畫面任何一處，調出功能表
<div style="color:white;background:var(--menubar-color)">⚙️設定📖經卷📑章節
<br/>🔊誦經🔎詞典
<br/>進階:📜原文🔀異譯📚集註</div>
<Switch bind:value label="啟動時顯示此畫面" design="slider" fontSize="4vh"/>
更新程序前，先清除瀏覽器快取
<br/>無法訪問Youtube，請設定視頻來源為Tencent
<br/>這是開源軟件，不會自動收集個人信息。我們盡量保證程序的正常運作以及內容的準確性。但萬一造成用戶任何損失，既不負責。
<br/><button style="font-size:150%" class="center" on:click={closePopup}>同意並開始使用</button>
</div>
</div>