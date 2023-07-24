<script>
import TranscriptLayer from './transcriptlayer.svelte';
import PuncLayer from './punclayer.svelte';
import TapMark from './tapmark.svelte';
import Swipe from './3rd/swipe.svelte';
import SwipeItem from './3rd/swipeitem.svelte';
import {rotatingwheel} from './3rd/rotatingwheel.js';
import {getAudioList} from './mediaurls.js'
import {favortypes, landscape} from './store.js'

export let src;

import {fetchFolioText,getConcreatePos,folio2ChunkLine,extractPuncPos,usePtk} from 'ptk'
import {ZipStore} from 'ptk/zip';
import {folioLines,folioChars,activePtk,activefolioid,activepb,favorites,videoid,ytplayer,showpunc,
    maxfolio,tapmark, playing, remainrollback, idlecount,showpaiji,idletime,loadingbook, selectmedia, prefervideo} from './store.js'
import { get } from 'svelte/store';

let ptk=usePtk($activePtk)
let foliotext='',foliofrom=0,puncs=[],ready,images=[],hidepunc=false;
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
    loadingbook.set(true);
    let host='folio/';
    if (document.location.host.startsWith('yonglezang.github.io')) {
        host='https://dharmacloud.github.io/swipegallery/folio/';
    } 
    const res=await fetch(host+src);
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
    confirmfavorite();
}
const updateFolioText=async ()=>{
    hidepunc=true;
    const fl=folioLines();
    [foliotext,foliofrom]=await fetchFolioText(ptk,$activefolioid,1+Math.floor($activepb));
    foliotext=foliotext.join('\n').replace(/【[^】]+】/,'').split('\n')
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
	const address= 'folio#'+$activefolioid + (ck?('.'+ ck):'') ;
    //remove after punc
    t=t.replace(/([。！？：、．；，「『（ ])/g,'　');
    while(t.charAt(0)=='　') t=t.slice(1);
    t=t.replace(/　.+/,'');
    console.log(address)
    await onTapText(t,address,ptk.name); 
}
const gotoPb=(pb)=>{
    if (!totalpages || !swiper)return;//not loaded yet
    const go=totalpages-pb-1;
    if (go!==defaultIndex) {
        // console.log('goto',pb, go, defaultIndex)
        swiper.goTo(go);
    }
    console.log('pb',pb,go)
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
    if (ls) {
        return 'width:'+(screen.height*0.5)+'pt';
    } else {
        return 'width:100%'
    }
    
}
const swipeStyle=(ls)=>{
    if (ls) {
        return 'left:0%;transform: translate(0%,-50%);'
    } else {
        return 'left:50%;transform: translate(-50%,-50%);'
    }
    
}
$: loadZip(src);
$: gotoPb($activepb); //trigger by goto folio in setting.svelte
$: audiolist=getAudioList($activefolioid);
</script>
<!-- svelte-ignore a11y-click-events-have-key-events -->
{#if ready}
{#key $landscape}
<div class="swipe-holder" on:wheel={mousewheel} style={holderWidth(get(landscape))}>
<Swipe bind:this={swiper} {...swipeConfig} {defaultIndex}
 on:click={onclick} on:start={swipeStart} on:change={swipeChanged}>
    {#each images as image,idx}
    <SwipeItem><img alt='no' class="swipe" style={swipeStyle(get(landscape))} src={images[images.length-idx-1]}/></SwipeItem>
    {/each}    
</Swipe>
</div>
{/key}
{:else}
<div class="message">{@html rotatingwheel}</div>
{/if}
<!-- svelte-ignore a11y-click-events-have-key-events -->
{#key favoritetimer}
<span class:blinkfavorbtn={!!favoritetimer} class="favoritebtn" on:click={favoritebtn}>{ favortypes[$favorites[$activefolioid]?.[$activepb]||0]}</span>
{/key}
<!-- svelte-ignore a11y-click-events-have-key-events -->
{#if !$landscape && $ytplayer && audiolist.length>1}
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
<TranscriptLayer frame={imageFrame()} {totalpages} folioLines={folioLines()} {swiper} {ptk} {foliotext}/>
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
.swipe {position:absolute;top:50%; }

</style>