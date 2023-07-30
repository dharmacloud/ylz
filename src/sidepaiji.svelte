<script>
import {sideWidth} from './store.js'
import {onDestroy} from 'svelte'

const texts=[
    '中部全國供佛齋僧大會',
    '時間軸※林★如',
    '時間軸※櫻井★志',
    '頁標記※䆁常明',
    '頁標記※謝★恆',
    '切圖※䆁★缽',
    '施主※甯★南',
]
let text=texts[ 0];
let timer=setInterval(()=>{
    text=texts[ Math.floor(Math.random()*texts.length) ];
},5000)
onDestroy(()=>{
    clearInterval(timer)
})
</script>
<div class="sidepaiji" style={sideWidth()}>
    <div class="sidesponsor">{text}</div>  
</div>