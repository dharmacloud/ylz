<script>
    import Endmarker from './endmarker.svelte';
import {_} from './textout.js'
</script>
<div>
<div>{_("捐獻記錄。祈願諸護持者以此功德，獲得無量世出世間的利益。")}</div>
<div>2023年</div>
<table>
    <tr><td>陳碧吟</td><td>1.12</td><td>美元 1,000</td></tr>
    <tr><td>甯耀南</td><td>5.21</td><td>{_("台幣")}  10,000</td></tr>
    <tr><td class="deceased">{_("葉雅柏")}</td><td>8.19</td><td>{_("泰銖")}40,000 </td></tr>
    <tr><td>李玉媚 </td><td>8.19 </td><td>{_("馬幣")} 5,000</td></tr>
    <tr><td>林嘉雯</td><td>8.27 </td><td>{_("台幣")} 1,000</td></tr>
    <tr><td>法王講堂</td><td>9.9 </td><td>{_("台幣")} 50,000</td></tr>
    <tr><td>施郁芳</td><td>9.13</td><td>{_("台幣")} 5,000</td></tr>
    <tr><td>天台精舍</td><td>12.30</td><td>{_("人民幣")} 5,000</td></tr>
</table>
<br/><div>2024年</div>
<table>
<tr><td>金門福慧寺</td><td>3.15</td><td>{_("台幣")} 6,000</td></tr>
</table>
<br/><div>2025年</div>
<table>
<tr><td>{_("紅坊老黃")} </td><td>3.5</td><td>{_("人民幣")} 2,000</td></tr>
</table>
<Endmarker/>
</div>