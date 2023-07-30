<script>
import TranscriptLayer from './transcriptlayer.svelte';
import PuncLayer from './punclayer.svelte';
import TapMark from './tapmark.svelte';
import Swipe from './3rd/swipe.svelte';
import SwipeItem from './3rd/swipeitem.svelte';
import {rotatingwheel} from './3rd/rotatingwheel.js';
import {getAudioList} from './mediaurls.js'
import {extractPuncPos,usePtk,FolioText, parseOfftext} from 'ptk'
import { CURSORMARK } from './nav.js';
import {ZipStore} from 'ptk/zip';
import {thezip,favortypes, landscape,foliotext,folioLines,folioChars,activePtk,activefolioid,activepb,favorites,videoid,showpunc,
playerready,maxfolio,tapmark, playing, remainrollback, idlecount,showpaiji,idletime,loadingbook, selectmedia, prefervideo} from './store.js'
import { get } from 'svelte/store';
export let src;


let ptk=usePtk($activePtk)
let foliopage=[],puncs=[],ready,images=[],hidepunc=false;
export let totalpages=0;
export let onTapText=function(){};
let swiper;
let defaultIndex=0;
let stableleft=0;
let favoritetimer=0;
const imageFrame=()=>{
    const img=document.getElementsByClassName('swipe')[defaultIndex];
	if (!img || !img.clientHeight) return [0,0,0,0];
    
	const r=img.clientHeight / img.naturalHeight;
    const rect=img.getBoundingClientRect();
    if (rect.left<0) {//還沒捲好
        rect.left=stableleft;
    } else {
        stableleft=rect.left; //穩定的
    }
	const w=img.naturalWidth * r;
	const left=Math.floor((img.clientWidth- w)/2) + rect.x;
	return {left,top:rect.y,width:w,height:img.clientHeight} ;
}

const swipeConfig = {
    autoplay: false,
    delay: 0,
    showIndicators: false,
    transitionDuration: 250
};

const loadZip=async ()=>{
    ready=false;
    loadingbook.set(true);
    let host='folio/';
    if (document.location.host.startsWith('yonglezang.github.io')) {
        host='https://dharmacloud.github.io/swipegallery/folio/';
    }
    const ftext=new FolioText(ptk);//fetchFolioText(ptk,$activefolioid);
    await ftext.load($activefolioid)
    foliotext.set(ftext);

    const res=await fetch(host+src);
    const buf=await res.arrayBuffer();
    const zip=new ZipStore(buf);
    thezip.set(zip);

    for (let i=0;i<zip.files.length;i++) {
        if (i==zip.files.length-1) {
            const blob=new Blob([zip.files[i].content]);
            images.push(URL.createObjectURL(blob));
        } else {
            images.push('frames/blank.png');
        }
    }

    defaultIndex=zip.files.length-1;
    totalpages=zip.files.length;
    maxfolio.set(totalpages-1);
    setTimeout(()=>{
        loadingbook.set(false);
        ready=true;
        tapmark.set(['1',2,0]); //normally text start from line 2
    },200);   
}
const swipeStart=(obj)=>{
    hidepunc=true;
}
const swipeChanged=(obj)=>{
    const {active_item}=obj.detail;
    defaultIndex=active_item;
    activepb.set( (totalpages- defaultIndex).toString() );
    let i=totalpages- defaultIndex-1;
    const wrapper=document.getElementsByClassName("swipeable-slot-wrapper")[0];
    const ele=wrapper.childNodes[defaultIndex].firstChild.firstChild;
    if (~ele.src.indexOf('blank')) {
        const blob=new Blob([get(thezip).files[i].content]);
        ele.src=images[i]=URL.createObjectURL(blob);
    }
    if (i<totalpages) { //buffer next page for smooter swipe
        i++
        const ele=wrapper.childNodes[defaultIndex-1].firstChild.firstChild;
        if (~ele.src.indexOf('blank')) {
            const blob=new Blob([get(thezip).files[i].content]);
            ele.src=images[i]=URL.createObjectURL(blob);
        }
    }

    updateFolioText();
    useractive();
    confirmfavorite();
}
const updateFolioText=()=>{
    hidepunc=true;
    const fl=folioLines();
    foliopage=get(foliotext).folioPageText($activepb);
    foliopage=foliopage.join('\n').replace(/【[^】]+】/,'').split('\n')
    setTimeout(()=>{
        hidepunc=false;
        puncs=extractPuncPos(foliopage,fl);
    },200); //wait until swiper stop
}
const useractive=()=>{
    showpaiji.set(false);
    idlecount.set(0);
    hidepunc=false;
}
const mousewheel=(e)=>{
	if (e.ctrlKey ) return;
    hidepunc=true;
	if (e.deltaY>0) {
		swiper.prevItem();
	} else {
        swiper.nextItem();
	}
    useractive();
	e.preventDefault();
}
const getCharXY=(x,y)=>{
	const {left,top,width,height}=imageFrame();
    x-=left;
    y-=top;	
    const cx=folioLines()-Math.floor((x/width)*folioLines())-1;
    const cy=Math.floor((y/height)*$folioChars);
    return [cx,cy];
}

const onfoliopageclick=e=>{
    if ($showpaiji) {
        useractive();
        return;
    }
    hidepunc=false;
    const {x,y}=e.detail;
    const [cx,cy]=getCharXY(x,y);
    if (cx>=folioLines()!==cx<0) return;
    tapmark.set([ $activepb ,cx,cy ]);
    const ft=get(foliotext);
    const {choff,linetext}=ft.fromFolioPos($activepb,cx,cy);
    const offtext=linetext.slice(0,choff)+CURSORMARK+linetext.slice(choff)
    let [t]=parseOfftext(offtext);
    t=t.replace(/([。！？：、．；，「『（ ])/g,'　');
    while(t.charAt(0)=='　') t=t.slice(1);
    t=t.replace(/　.+/,'');
    onTapText(t,ptk.name); 
}
const gotoPb=async (pb)=>{
    if (!totalpages || !swiper)return;//not loaded yet
    const go=totalpages-parseInt(pb);
    if (go!==defaultIndex) {
        // console.log('goto',pb, go, defaultIndex)
        swiper.goTo(go);
    }
}
const confirmfavorite=()=>{
    if (favoritetimer) {
        clearTimeout(favoritetimer);
        favoritetimer=0;
    }
    cancellable=true;
    const pb=$activepb;
    const f=$favorites[$activefolioid]?.[pb];
    if (f) { //remove all other same favorite type in this folio
        const bookfavor=Object.assign({},$favorites);
        for (let i in $favorites[$activefolioid]) {
            const f2=$favorites[$activefolioid][i]
            if (f2==f && pb !==parseInt(i)) {
                delete $favorites[$activefolioid][i];
            }
        }
        favorites.set(Object.assign({},bookfavor));
    }
}
let cancellable=true;
const favoritebtn=()=>{
    if ($activePtk!=='dc') return;//only support chinese

    clearTimeout(favoritetimer);
    favoritetimer=setTimeout(()=>{
        confirmfavorite();
    },5000)
    const bookfavor=Object.assign({},$favorites);

    if (!bookfavor[$activefolioid]) {
       bookfavor[$activefolioid]={};
    }
    const type=bookfavor[$activefolioid][$activepb];

    if (!type) {
        cancellable=false;
        bookfavor[$activefolioid][$activepb]=1;
    } else {
        if (cancellable) {
            delete bookfavor[$activefolioid][$activepb];
            clearTimeout(favoritetimer);
            favoritetimer=0;
        } else {
            let i=bookfavor[$activefolioid][$activepb]+1;
            if (i>=favortypes.length) i=1;
            bookfavor[$activefolioid][$activepb]=i;
            cancellable=false;
        }
    }
    favorites.set(Object.assign({},bookfavor));
}
const toggleplaybtn=()=>{
    if (!get(videoid)) {
        if (audiolist.length<2) return;
        const pick=  Math.floor(Math.random()*(audiolist.length-1))+1;
        const vid= $prefervideo[$activefolioid] || audiolist[pick]?.vid;
        selectmedia(vid);
    } else {
        selectmedia('');
    }
}
const holderWidth=ls=>{
    let style='width:100vw'
    if (ls) {
        const w=(screen.height *0.45);
        const r=Math.floor(w*100/screen.width)+1;
        style='width:'+r+'vw';
    }
    setTimeout(()=>{
        swiper.update();
    },10)
    return style;
}

$: loadZip(src);
$: gotoPb($activepb); //trigger by goto folio in setting.svelte
$: audiolist=getAudioList($activefolioid);
</script>
<!-- svelte-ignore a11y-click-events-have-key-events -->
{#if ready}
<div class="swipe-holder" on:wheel={mousewheel} style={holderWidth($landscape)}>
<Swipe bind:this={swiper} {...swipeConfig} {defaultIndex}
 on:click={onfoliopageclick} on:start={swipeStart} on:change={swipeChanged}>
    {#each images as image,idx}
    <SwipeItem><img alt='no' class="swipe"  src={images[images.length-idx-1]}/></SwipeItem>
    {/each}    
</Swipe>
</div>

{:else}
<div class="message">{@html rotatingwheel}</div>
{/if}
<!-- svelte-ignore a11y-click-events-have-key-events -->
{#key favoritetimer}
<span class:blinkfavorbtn={!!favoritetimer} class="favoritebtn" on:click={favoritebtn}>{ favortypes[$favorites[$activefolioid]?.[$activepb]||0]}</span>
{/key}
<!-- svelte-ignore a11y-click-events-have-key-events -->
{#if !$landscape && $playerready && audiolist.length>1}
<span class="playbtn" on:click={toggleplaybtn}>{$videoid?'◼':'♫'}</span>
{/if}

<span class="pagenumber">{totalpages-defaultIndex}</span>
{#if $playing}
<span class="remainrollback">{$remainrollback>0?$remainrollback:''}</span>
{:else if !$showpaiji}
<span class="idletime">{$idlecount>=idletime-15?idletime-$idlecount:''}</span>
{/if}

{#key $tapmark+$activepb}
{#if !hidepunc && !$showpaiji}
<TapMark mark={$tapmark} pb={$activepb} folioChars={$folioChars} folioLines={folioLines()} frame={imageFrame()}  />
{/if}
{/key}
{#key puncs}
{#if !hidepunc}
{#if $showpunc=='on'}
<PuncLayer frame={imageFrame()} folioChars={$folioChars} folioLines={folioLines()} {puncs} />
{/if}
<TranscriptLayer frame={imageFrame()} {totalpages} folioLines={folioLines()} {swiper} {ptk} {foliopage}/>
{/if}
{/key}

<!-- {#if $mediaid} -->

<!-- {/if} -->


<style>
img { height:100%}
.message {position:absolute;top:50%;left:50%;transform: translate(-50%,-50%); }
.swipe-holder{
    height: 100%;
    /* width:100%; */
}
.swipe {position:absolute;}

</style>