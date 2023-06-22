<script>
import {stylestring} from './unit.js'
import {activefolio,mediaid,folioLines,folioChars,playing, player,continueplay} from './store.js'
import {mediaurls} from './mediaurls.js'
import {get} from 'svelte/store'
import {onDestroy} from 'svelte'
import {concreateLength} from 'ptk'
export let frame={},totalpages;
export let foliotext=[];
const strips=new Array($folioLines);
const timers=[];
onDestroy(()=>{
    destroyTimer();
})
const stripstyle=(i,strip)=>{
    if (i==0) {
        destroyTimer();
    }
    let fl=get(folioLines)
    let fc=get(folioChars)
    const w=frame.width/fl;
    let out=[];
    out.push('position:absolute');
    out.push('left:'+Math.floor( (fl-i-1)*w)+'px');
    out.push('top:0px');
    out.push('width:'+Math.floor(w)+'px');
    out.push('height:0px');
    const {timestamp} = mediaurls[$mediaid];
    if (!timestamp) {
        return out.join(';'); //cannot play
    }
    const line=get(activefolio)*fl;

    if (!timestamp[line] && i==0) { //read the end
        continueplay.set(false); 
        activefolio.set(0); 
    }
    const playertime=get(player).getCurrentTime();
    let timedelta=playertime-timestamp[line];//player 跑得比較快。（因換頁動畫時間），需修正
    if (Math.abs(timedelta)>3 ) { //不會差這麼多，是快速滑輪造成。getCurrentTime 未切到
        timedelta=0.02;
    }
    let delay=(timestamp[line+i]  - timestamp[line] - timedelta )*1000 ;
    if (i==0&&delay<30) delay=30;// too small value  cause immediate trigger fire
    // console.log(i,'delay',delay)
    const fire=(function(){
        if (this.folio!==get(activefolio)) return;
        // console.log('fire',this.idx, 'folio',this.folio, 'activefolio',get(activefolio))
        const ele=document.getElementById('strip'+this.idx);
        if (!ele) return;
        const chcount=concreateLength(foliotext[i]||'')
        ele.style.height=Math.floor( chcount*(frame.height/fc))+'px';
    }).bind({idx:i,folio:get(activefolio)});
    
    timers.push(setTimeout( fire,  delay)); 

    duration=timestamp[line+i+1]-timestamp[line+i];
    if (duration==0 && i+1 <fl) {//empty line , 
        duration=timestamp[line+i+2]-timestamp[line+i];
    }
    out.push('transition:height '+duration+'s  linear');

    if (i==strips.length-1) {
        timers.push( setTimeout(()=>{
            if (get(activefolio)<totalpages-1) { 
                continueplay.set(true); //auto swipe , do not trigger 
                activefolio.set(get(activefolio)+1);
                setTimeout(()=>{
                    continueplay.set(false);// user swipe manually
                },100);            
            }
        }, (timestamp[line+i+1] - timestamp[line] -timedelta)*1000));
    }
    return out.join(';');
}
const destroyTimer=()=>{
    timers.forEach( it=>clearTimeout(it));
    timers.length=0;
}
</script>
{#if $playing && mediaurls[$mediaid].timestamp }
{#key $activefolio}
<div class="transcript" style={stylestring(frame)} >
    {#each strips as strip,idx}
        <div class="strip" id={'strip'+idx} style={stripstyle(idx,strip)}/>
    {/each}
</div>
{/key}
{/if} 
