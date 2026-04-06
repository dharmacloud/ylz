<script>
import Endmarker from './endmarker.svelte';
import {_} from './textout.js'
</script>
<div>

<div>{_("贊助擴編經卷芳名錄")}</div>
<div>2026年</div>
<table>
<tr><td>{_("功德芳名")}</td><td>{_("贊助日期")}</td><td>{_("卷數")}</td></tr>

<tr><td>新時代華嚴文化研究院</td><td>3.8</td><td>華嚴經180卷</td></tr>
<tr><td>妙慧</td><td>2.17</td><td>一卷</td></tr>
</table>

<br/>
<div>{_("贊助開發及經卷製作芳名錄")}</div>
<div>2025年</div>
<table>
<tr><td>{_("紅坊老黃")} </td><td>3.5</td><td>{_("人民幣")} 2,000</td></tr>
</table>

<br/><div>2024年</div>
<table>
<tr><td>金門福慧寺</td><td>3.15</td><td>{_("台幣")} 6,000</td></tr>
</table>

<br/><div>2023年</div>
<table>
    <tr><td>陳碧吟</td><td>1.12</td><td>美元 1,000</td></tr>
    <tr><td>甯耀南</td><td>5.21</td><td>{_("台幣")}  10,000</td></tr>
    <tr><td class="deceased">{_("葉雅柏")}</td><td>8.19</td><td>{_("泰銖")}40,000 </td></tr>
    <tr><td>李玉媚 </td><td>8.19 </td><td>{_("馬幣")} 5,000</td></tr>
    <tr><td>林嘉雯</td><td>8.27 </td><td>{_("台幣")} 1,000</td></tr>
    <tr><td>法王講堂</td><td>9.9 </td><td>{_("台幣")} 50,000</td></tr>
    <tr><td>施郁芳</td><td>9.13</td><td>{_("台幣")} 5,000</td></tr>
    <tr><td>香港天台精舍</td><td>12.30</td><td>{_("人民幣")} 5,000</td></tr>
</table>

<div>{_("祈願諸護持者以此功德，獲得無量的利益。")}</div>


<Endmarker/>
</div>

<style>
    table {
      border-collapse: collapse; /* 合併邊框 */
      width: 100%;
    }
    td {
      border: 1px solid #000; /* 黑色 1px 實線 */
      padding: 1px;
      text-align: left;
    }
    tr:nth-child(odd) {
        background-color: rgb(255, 254, 166)
    }
</style>