<script>
import {stylestring} from './unit.js'
import {activefolio,mediaid,folioLines,playing, continueplay} from './store.js'
import {mediaurls} from './mediaurls.js'
import {get} from 'svelte/store'
import {onDestroy} from 'svelte'
export let frame={},totalpages;
console.log(frame)
const strips=new Array($folioLines);
const timers=[];
onDestroy(()=>{
    destroyTimer();
})
const stripstyle=(i,strip)=>{
    if (i==0) {
        destroyTimer();
    }
    const w=frame.width/get(folioLines);
    let out=[];
    out.push('position:absolute');
    out.push('left:'+Math.floor( (get(folioLines)-i-1)*w)+'px');
    out.push('top:0px');
    out.push('width:'+Math.floor(w)+'px');
    out.push('height:0px');
    const {timestamp} = mediaurls[$mediaid];
    if (!timestamp) {
        return out.join(';'); //cannot play
    }
    const smalldelay=30; 
    const line=get(activefolio)*get(folioLines);

    if (!timestamp[line] && i==0) { //read the end
        continueplay.set(false); 
        activefolio.set(0); 
    }
    const delay=smalldelay+(timestamp[line+i]  - timestamp[line])*1000;
    const fire=(function(){
        if (this.folio!==get(activefolio)) return;
        // console.log('fire',this.idx, 'folio',this.folio, 'activefolio',get(activefolio))
        const ele=document.getElementById('strip'+this.idx);
        if (!ele) return;
        ele.style.height=Math.floor(frame.height)+'px';
    }).bind({idx:i,folio:get(activefolio)});
    
    timers.push(setTimeout( fire,  delay)); 

    duration=timestamp[line+i+1]-timestamp[line+i];

    out.push('transition:height '+duration+'s  linear');

    if (i==strips.length-1) {
        timers.push( setTimeout(()=>{
            if (get(activefolio)<totalpages-1) {
                continueplay.set(true); 
                activefolio.set(get(activefolio)+1);
                setTimeout(()=>{
                    continueplay.set(false);// user swipe manually
                },100);            
            }
        }, smalldelay+(timestamp[line+i+1] - timestamp[line] )*1000));
    }
    return out.join(';');
}
const destroyTimer=()=>{
    timers.forEach( it=>clearTimeout(it));
    timers.length=0;
}
</script>
{#if $playing && mediaurls[$mediaid].timestamp }
{#key $mediaid, $activefolio}
<div class="transcript" style={stylestring(frame)} >
    {#each strips as strip,idx}
        <div class="strip" id={'strip'+idx} style={stripstyle(idx,strip)}/>
    {/each}
</div>
{/key}
{/if} 
