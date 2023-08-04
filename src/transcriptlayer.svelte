<script>
import {stylestring} from './unit.js'
import {activepb,audioid,folioLines,foliotext,folioChars,playing,selectmedia,mediaurls,
    stopAudio,remainrollback, player,continueplay, findByAudioId, playnextjuan, activefolioid} from './store.js'
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
    let r=get(remainrollback);
    if (r>0) {
        r--;
        remainrollback.set(r);
    }
    if (r==0) stopAudio();
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
            console.log('loading next juan',nextfolioid)
            loadFolio(nextfolioid,function(){
                const audiolist=$mediaurls;
                console.log('audiolist',audiolist,nextfolioid)
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
    const {timestamp} = findByAudioId($audioid);
    if (!timestamp) {
        return out.join(';'); //cannot play
    }
    const line=(parseInt(get(activepb))-1)*fl;

    if (!timestamp[line] && i==0) { //read the end
        playnext();
    }
    const playertime=player?.currentTime;
    let timedelta=playertime-timestamp[line];//player 跑得比較快。（因換頁動畫時間），需修正
    if (Math.abs(timedelta)>3 ) { //不會差這麼多，是快速滑輪造成。getCurrentTime 未切到
        timedelta=0.02;
    }

    if (i==0) { //翻頁timer
        timers.push( setTimeout(()=>{
            if ( parseInt(get(activepb))<totalpages) { 
                continueplay.set(true); //auto swipe , do not trigger 
                activepb.set( parseInt(get(activepb))+1);
                setTimeout(()=>{
                    continueplay.set(false);// user swipe manually
                },500);            
            } else {
                playnext();
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
        const chcount=get(foliotext).countFolioChar(foliopage[i]||'');
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
{#if $playing && findByAudioId($audioid) }
{#key $activepb,$audioid}
<div class="transcript" style={stylestring(frame)} >
    {#each strips as strip,idx}
        <div class="strip" id={'strip'+idx} style={stripstyle(idx,strip)}/>
    {/each}
</div>
{/key}
{/if} 