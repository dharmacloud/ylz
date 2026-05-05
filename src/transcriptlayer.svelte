<script>
import {stylestring} from './unit.js'
import {activepb,audioid,folioLines,foliotext,folioChars,playing,selectmedia,mediaurls,
    timeline,stopAudio, player,continueplay,  playnextjuan, activefolioid,
    infiniteplay} from './store.js'
import {get} from 'svelte/store'

import {onDestroy} from 'svelte'
import { allJuan, loadFolio } from './nav.js';
export let frame={},totalpages;
export let foliopage=[];
export let ptk;
const strips=new Array(folioLines());
const timers=[];
onDestroy(()=>{
    destroyTimer();
});

const rollback=()=>{
    continueplay.set(false); 
    activepb.set('1');
    if (!get(infiniteplay)) {
        stopAudio();
    }
}
const playnext=()=>{
    const juans=allJuan(ptk);
    const folioid=$activefolioid;
    const vid=$audioid;
    //get the media index in this juan
    const thisaudiolist=$mediaurls;
    let performer='';
    for (let i=0;i<thisaudiolist.length;i++) {
        if (thisaudiolist[i].vid==vid) performer=thisaudiolist[i].performer;
    }
    if ( $playnextjuan=='on' && juans.length>1 ) {
        const juannow=folioid.match(/(\d+)$/)[1];
        if (parseInt(juannow)==juans.length) {
            rollback();
        } else {        
            const nextfolioid=folioid.replace(juannow,parseInt(juannow)+1);
            // console.log('loading next juan',nextfolioid)
            loadFolio(nextfolioid,function(){
                const audiolist=$mediaurls;
                // console.log('audiolist',audiolist,nextfolioid)
                if (audiolist) {
                    const sameperformer=audiolist.filter(it=>it.performer==performer);
                    const vid=sameperformer.length?sameperformer[0].vid:audiolist[0].vid;
                    selectmedia(vid);
                }
            });
        }
    } else {
        rollback();
    }
}

const getTimestamp=(nfolio,nline=0)=>{
    const timestamps=get(timeline)?.timestamps;
    if (!timestamps?.length) return -1;
    return (timestamps[nfolio]||[])[nline]||-1;
}
const getNextTimestamp=(nfolio,nline=0)=>{
    if (nline<folioLines()) {
        return getTimestamp(nfolio,nline+1);
    } else {
        return getTimestamp(nfolio+1,0);
    }
}
const getLastTimestamp=()=>{
    const timestamps=get(timeline)?.timestamps;
    for (let i=timestamps.length-1;i>=0;i--) {
        if (timestamps[i]?.length) {
            for (let j=timestamps[i].length-1;j>=0;j--) {
                if (timestamps[i][j]) return timestamps[i][j];
            }
        }
    }
}

const stripstyle=(i,strip)=>{
    if (i==0) {
        destroyTimer();
    }
    //duplicate repaint after continueplay is on
    
    let fl=folioLines();
    let fc=get(folioChars)
    const w=frame.width/fl;
    let out=[];
    out.push('position:absolute');
    out.push('left:'+Math.floor( (fl-i-1)*w)+'px');
    out.push('top:0px');
    out.push('width:'+Math.floor(w)+'px');
    out.push('height:0px');
    const {timestamps} = get(timeline)||{};
    if (!timestamps?.length) {
        return out.join(';'); //cannot play
    }

    const pb=parseInt(get(activepb))-1;

    /*
    if (!timestamps[line] && i==0) { //read the end
        playnext();
    }
        */
    const playertime=player?.currentTime;
    let timedelta=playertime-getTimestamp(pb);//player 跑得比較快。（因換頁動畫時間），需修正
    if (Math.abs(timedelta)>3 ) { //不會差這麼多，是快速滑輪造成。getCurrentTime 未切到
        timedelta=0.02;
    }

    if (i==0) { //翻頁timer
        const lastlinet=getTimestamp(pb+1,0)|| getLastTimestamp();
        const nextpagetime= ( lastlinet - getTimestamp(pb) -timedelta)*1000;
        timers.push( setTimeout(()=>{
            if ( parseInt(get(activepb))<totalpages) { 
                continueplay.set(true); //auto swipe , do not trigger 
                activepb.set( (parseInt(get(activepb))+1).toString());
                setTimeout(()=>{
                    continueplay.set(false);// user swipe manually
                },500);            
            } else {
                // playnext();
            }
        },nextpagetime));
    }
    let delay=(getTimestamp(pb,i)  - getTimestamp(pb) - timedelta )*1000 ;
    if (i==0&&delay<30) delay=30;// too small value  cause immediate trigger fire
    // console.log(i,'delay',delay)
    const fire=(function(){
        if (this.folio!=get(activepb)) return;
        // console.log('fire',this.idx, 'folio',this.folio, 'activepb',get(activepb))
        const ele=document.getElementById('strip'+this.idx);
        if (!ele) return;
        const chcount=get(foliotext).countFolioChar(foliopage[i]||'');
        ele.style.height=Math.floor( chcount*(frame.height/fc))+'px';
    }).bind({idx:i,folio:get(activepb)});
    
    timers.push(setTimeout( fire,  delay)); 

    let duration=getNextTimestamp(pb,i)-getTimestamp(pb,i);
    if (duration==0 && i+1 <fl) {//empty line , try next line
        duration=getNextTimestamp(pb,i+1)-getTimestamp(pb,i);
    }
    out.push('transition:height '+duration+'s  linear'); //

    return out.join(';');
}

const destroyTimer=()=>{
    timers.forEach( it=>clearTimeout(it));
    timers.length=0;
}

</script>
{#if $playing && $timeline?.timestamps?.length && $audioid}
{#key $activepb,$audioid}
<div class="transcript" style={stylestring(frame)} >
    {#each strips as strip,idx}
        <div class="strip" id={'strip'+idx} style={stripstyle(idx,strip)}/>
    {/each}
</div>
{/key}
{/if} 