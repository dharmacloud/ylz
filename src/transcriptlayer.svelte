<script>
import {stylestring} from './unit.js'
import {activepb,videoid,folioLines,folioChars,playing,
    stopVideo,remainrollback, player,continueplay, findByVideoId} from './store.js'
import {get} from 'svelte/store'
import {onDestroy} from 'svelte'
import {concreateLength} from 'ptk'
export let frame={},totalpages;
export let foliotext=[];

const strips=new Array(folioLines());
const timers=[];
onDestroy(()=>{
    destroyTimer();
});
const rollback=()=>{
    continueplay.set(false); 
    activepb.set(0);
    let r=get(remainrollback);
    if (r>0) {
        r--;
        remainrollback.set(r);
    }
    if (r==0) stopVideo();
}
const stripstyle=(i,strip)=>{
    if (i==0) {
        destroyTimer();
    }
    if (get(continueplay)) return;//save one repaint, prevent redraw first strip
    let fl=folioLines();
    let fc=get(folioChars)
    const w=frame.width/fl;
    let out=[];
    out.push('position:absolute');
    out.push('left:'+Math.floor( (fl-i-1)*w)+'px');
    out.push('top:0px');
    out.push('width:'+Math.floor(w)+'px');
    out.push('height:0px');
    const {timestamp} = findByVideoId($videoid);
    if (!timestamp) {
        return out.join(';'); //cannot play
    }
    const line=get(activepb)*fl;

    if (!timestamp[line] && i==0) { //read the end
        rollback();
    }
    const playertime=player($videoid)?.getCurrentTime();
    let timedelta=playertime-timestamp[line];//player 跑得比較快。（因換頁動畫時間），需修正
    if (Math.abs(timedelta)>3 ) { //不會差這麼多，是快速滑輪造成。getCurrentTime 未切到
        timedelta=0.02;
    }

    if (i==0) { //翻頁timer
        timers.push( setTimeout(()=>{
            if (get(activepb)<totalpages-1) { 
                continueplay.set(true); //auto swipe , do not trigger 
                activepb.set(get(activepb)+1);
                setTimeout(()=>{
                    continueplay.set(false);// user swipe manually
                },100);            
            } else {
                rollback();
            }
        }, (timestamp[line+fl] - timestamp[line] -timedelta)*1000));
    }
    let delay=(timestamp[line+i]  - timestamp[line] - timedelta )*1000 ;
    if (i==0&&delay<30) delay=30;// too small value  cause immediate trigger fire
    // console.log(i,'delay',delay)
    const fire=(function(){
        if (this.folio!==get(activepb)) return;
        // console.log('fire',this.idx, 'folio',this.folio, 'activepb',get(activepb))
        const ele=document.getElementById('strip'+this.idx);
        if (!ele) return;
        const chcount=concreateLength(foliotext[i]||'')
        ele.style.height=Math.floor( chcount*(frame.height/fc))+'px';
    }).bind({idx:i,folio:get(activepb)});
    
    timers.push(setTimeout( fire,  delay)); 

    duration=timestamp[line+i+1]-timestamp[line+i];
    if (duration==0 && i+1 <fl) {//empty line , try next line
        duration=timestamp[line+i+2]-timestamp[line+i];
    }
    out.push('transition:height '+duration+'s  linear'); //
    return out.join(';');
}

const destroyTimer=()=>{
    timers.forEach( it=>clearTimeout(it));
    timers.length=0;
}

</script>
{#if $playing && findByVideoId($videoid) }
{#key $activepb}
<div class="transcript" style={stylestring(frame)} >
    {#each strips as strip,idx}
        <div class="strip" id={'strip'+idx} style={stripstyle(idx,strip)}/>
    {/each}
</div>
{/key}
{/if} 