<script>
import {newbie,showpunc,showsponsor} from './store.js'
import Switch from './3rd/switch.svelte';
</script>

<div class="toctext">
版本：2023.8.4 自由软件

<br/>请留言「护持永乐藏」项目。收款人暱称是「数字三藏」。頭像是<img src="logo128.png" alt=""/>
<br/>人民币100元以下捐款，恕不单独列功德芳名，统一合并为「三宝弟子」。
<img alt="" style="width:100%" src="alipay.jpg"/>

<br/>LINE搜尋ID @dharmacloud，或加入<a href="https://lin.ee/1tmTKXi">官方帳號</a>，獲得更新訊息。
<Switch bind:value={$showpunc} label="顯示標點符號" design="slider" fontSize="24"/>
<Switch bind:value={$showsponsor} label="靜置時顯示功德榜" design="slider" fontSize="24"/>
<Switch bind:value={$newbie} label="啟動時顯示歡迎畫面" design="slider" fontSize="24"/>

<br/>本圖文對照數據庫主要基於以下素材：
<br/>永樂南北藏(山東省圖書館)、金剛經集註(朱棣)、梵文原典(<a target=_new href="https://www.dsbcproject.org/">Digital Sanskrit Buddhist Canon</a>, <a target=_new href="https://ancient-buddhist-texts.net">Ancient Buddhist Texts</a>)、
經文新式標點(CBETA)、梵漢佛經對勘叢書（黃寶生，中國社會科學出版社）、維基百科及各種佛學詞典之詞條、Youtube 公開影片。
<br/>數字加工：按手機比例裁圖及修圖、文字與圖片逐行對齊、原文及各種譯本逐句對齊、誦經影片時間軸。
<br/>授權方式：<a href="https://creativecommons.org/publicdomain/zero/1.0/deed.zh">Creative Common Zero</a>

<div class="endmarker">※※※</div>
</div>

