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
<br/>全螢幕模式安裝步驟
<br/>Android:使用Chrome，右上角功能表→安裝應用程式
<br/>iOS: 分享→加到主畫面
<br/>♫誦經 再點一次停止。
<br/>♡書籤。閃爍時再點擊改變顏色，不閃爍時再點取消。
<br/>不會收集個人資訊，使用本軟件的任何結果請自行承擔。
<br/><button style="font-size:150%;width:100%" on:click={closePopup}>同意</button>
<Switch bind:value label="啟用時顯示此畫面" design="slider" fontSize="24"/>
</div>
</div>