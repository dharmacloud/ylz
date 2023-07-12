<script>
import TranscriptLayer from './transcriptlayer.svelte';
import PuncLayer from './punclayer.svelte';
import TapMark from './tapmark.svelte';
import Swipe from './3rd/swipe.svelte';
import SwipeItem from './3rd/swipeitem.svelte';
import {rotatingwheel} from './3rd/rotatingwheel.js';
import {getAudioList} from './mediaurls.js'
export let src;

import {fetchFolioText,getConcreatePos,folio2ChunkLine,extractPuncPos,usePtk} from 'ptk'
import {ZipStore} from 'ptk/zip';
import {folioLines,folioChars,activePtk,activefolioid,activepb,favorites,videoid,ytplayer,qqplayer,
    maxfolio,tapmark, playing, remainrollback, idlecount,showpaiji,idletime,loadingbook, selectmedia} from './store.js'
    import { get } from 'svelte/store';
    import Audio from './audio.svelte';

let ptk=usePtk($activePtk)
let foliotext='',foliofrom=0,puncs=[],ready,images=[],hidepunc=false;
export let totalpages=0;
export let onTapText=function(){};
let swiper;
let defaultIndex=0;
let stableleft=0;
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
    loadingbook.set(true);
    const res=await fetch('folio/'+src);
    const buf=await res.arrayBuffer();
    const zip=new ZipStore(buf);
    for (let i=0;i<zip.files.length;i++) {
        const blob=new Blob([zip.files[i].content]);
        images.push(URL.createObjectURL(blob));
    }
    defaultIndex=zip.files.length-1;
    totalpages=zip.files.length;
    maxfolio.set(totalpages-1);
    setTimeout(()=>{
        loadingbook.set(false);
        ready=true;
    },300);   
}
const swipeStart=(obj)=>{
    hidepunc=true;
}
const swipeChanged=(obj)=>{
    const {active_item}=obj.detail;
    defaultIndex=active_item;
    activepb.set(totalpages- defaultIndex-1);
    updateFolioText();
    useractive();
}
const updateFolioText=async ()=>{
    hidepunc=true;
    const fl=folioLines();
    [foliotext,foliofrom]=await fetchFolioText(ptk,$activefolioid,1+Math.floor($activepb));
    console.log(foliotext)
    setTimeout(()=>{
        hidepunc=false;
        puncs=extractPuncPos(foliotext,fl);
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

const onclick=async (e)=>{
    if ($showpaiji) {
        useractive();
        return;
    }
    hidepunc=false;
    const {x,y}=e.detail;
    const [cx,cy]=getCharXY(x,y);
    const tappos=folioLines()*$folioChars*$activepb+ cx*$folioChars + cy;
    tapmark.set(tappos);
    // console.log('tappos',tappos,'click',cx,cy)
    let [t,pos]=getConcreatePos(foliotext[cx],cy,foliotext[cx+1]);
	//get the ck-lineoff 
    const ck=await folio2ChunkLine(ptk,foliotext, foliofrom,cx,pos);;
	const address= 'bk#'+$activefolioid + (ck?('.'+ ck):'') ;
    //remove after punc
    t=t.replace(/([。！？：、．；，「『（ ])/g,'　');
    while(t.charAt(0)=='　') t=t.slice(1);
    t=t.replace(/　.+/,'');
    
    await onTapText(t,address,ptk.name); 
}
const gotoPb=(pb)=>{
    if (!totalpages || !swiper)return;//not loaded yet
    const go=totalpages-pb-1;
    if (go!==defaultIndex) {
        // console.log('goto',pb, go, defaultIndex)
        swiper.goTo(go);
    }
}

const togglefavoritebtn=()=>{
    if ($activePtk!=='dc') return;//only support chinese
    const bookfavor=Object.assign({},$favorites);
    if (!bookfavor[$activefolioid]) {
        bookfavor[$activefolioid]={};
    }
    bookfavor[$activefolioid][$activepb]=1- (bookfavor[$activefolioid][$activepb]?1:0);
    favorites.set(Object.assign({},bookfavor));
}
const toggleplaybtn=()=>{
    if (!get(videoid)) {
        if (audiolist.length<2) return;
        const pick=Math.floor(Math.random()*(audiolist.length-1))+1;
        selectmedia(audiolist[pick]?.vid);
    } else {
        selectmedia('');
    }
}
$: loadZip(src);
$: gotoPb($activepb); //trigger by goto folio in setting.svelte
$: audiolist=getAudioList($activefolioid);
</script>
<!-- svelte-ignore a11y-click-events-have-key-events -->
{#if ready}
<div class="swipe-holder" on:wheel={mousewheel} >
<Swipe bind:this={swiper} {...swipeConfig} {defaultIndex} on:click={onclick} on:start={swipeStart} on:change={swipeChanged}>
    {#each images as image,idx}
    <SwipeItem><img alt='no' class="swipe" src={images[images.length-idx-1]}/></SwipeItem>
    {/each}    
</Swipe>
</div>
{:else}
<div class="message">{@html rotatingwheel}</div>
{/if}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<span class="favoritebtn" on:click={togglefavoritebtn}>{($favorites[$activefolioid]?.[$activepb])?'♥':'♡'}</span>
<!-- svelte-ignore a11y-click-events-have-key-events -->
{#if $ytplayer && audiolist.length>1}
<span class="playbtn" on:click={toggleplaybtn}>{$videoid?'⏹':'⏵'}</span>
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
<PuncLayer frame={imageFrame()} folioChars={$folioChars} folioLines={folioLines()} {puncs} />
<TranscriptLayer frame={imageFrame()} {totalpages} folioLines={folioLines()} {swiper} {foliotext}/>
{/if}
{/key}

<!-- {#if $mediaid} -->

<!-- {/if} -->


<style>
img { height:100%}
.message {position:absolute;top:50%;left:50%;transform: translate(-50%,-50%); }
.swipe-holder{
    height: 100%;
    width: 100%; 
    
}
.swipe {position:absolute;top:50%;left:50%;transform: translate(-50%,-50%); }

</style>