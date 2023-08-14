<script>
import TranscriptLayer from './transcriptlayer.svelte';
import PuncLayer from './punclayer.svelte';
import TapMark from './tapmark.svelte';
import Swipe from './3rd/swipe.svelte';
import SwipeItem from './3rd/swipeitem.svelte';
import {downloadToCache} from './comps/downloader.js'
import {extractPuncPos,usePtk,FolioText, parseOfftext} from 'ptk'
import { CURSORMARK } from './nav.js';
import {ZipStore} from 'ptk/zip';
import DownloadStatus from './downloadstatus.svelte'
import {thezip,favortypes, landscape,foliotext,folioLines,isSidePaiji,tapAddress,
    folioChars,activePtk,activefolioid,activepb,favorites,audioid,showpunc,
maxfolio,tapmark, playing, remainrollback, showyoutube,
idlecount,showpaiji,loadingbook, selectmedia, preferaudio,folioHolderWidth,leftmode,mediaurls, downloading} from './store.js'
import { get } from 'svelte/store';
import { fetchAudioList } from './mediaurls';
import { updateUrl } from './urlhash';
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
    // console.log('load zip',$activefolioid)
    ready=false;
    loadingbook.set(true);
    let host='folio/';

    const ftext=new FolioText(ptk);//fetchFolioText(ptk,$activefolioid);
    await ftext.load($activefolioid)
    foliotext.set(ftext);

    // const res=await fetch(host+src);
    const res=await downloadToCache(host+src,msg=>{
        downloading.set(msg);
    });
    downloading.set('');
    const buf=await res.arrayBuffer();
    const zip=new ZipStore(buf);
    thezip.set(zip);
    images.length=0;
    for (let i=0;i<zip.files.length;i++) {
        if (i==zip.files.length-1) {
            const blob=new Blob([zip.files[i].content]);
            images.push(URL.createObjectURL(blob));
        } else {
            images.push('frames/blank.png');
        }
    }

    defaultIndex=zip.files.length-parseInt($activepb);
    totalpages=zip.files.length;
    setTimeout(()=>{
        maxfolio.set(totalpages-1);
        loadingbook.set(false);
        ready=true;
        // console.log('loaded zip')
        fetchAudioList($activefolioid,mediaurls,$showyoutube=='on')
        
    },100);   
}
const swipeStart=(obj)=>{
    hidepunc=true;
}
const swipeChanged=(obj)=>{
    if (!ready) return;
    const {active_item}=obj.detail;
    defaultIndex=active_item;
    const newpb=(totalpages- defaultIndex).toString();
    
    if ($activepb!=newpb) {
        activepb.set(  newpb);
    }
    let i=totalpages- defaultIndex-1;
    const wrapper=document.getElementsByClassName("swipeable-slot-wrapper")[0];
    if (!wrapper) return;
    const ele=wrapper.childNodes[defaultIndex]?.firstChild.firstChild;
    if (!ele) return;
    if (~ele.src.indexOf('blank')) {
        const blob=new Blob([get(thezip).files[i].content]);
        ele.src=images[i]=URL.createObjectURL(blob);
    }
    if (i+1<totalpages) { //buffer next page for smooter swipe
        i++
        const ele=wrapper.childNodes[defaultIndex-1]?.firstChild.firstChild;
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
const useractive=(humanaction=false)=>{
    if (!isSidePaiji() || humanaction) {
        showpaiji.set(false);
        idlecount.set(0);
    }
    hidepunc=false;
}
const mousewheel=(e)=>{
    if ($leftmode!=='folio') return;
	if (e.ctrlKey ) return;
    hidepunc=true;
	if (e.deltaY>0) {
		swiper.prevItem();
	} else {
        swiper.nextItem();
	}
    useractive(true);
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
    if ($showpaiji && !isSidePaiji()) {
        useractive(true);
        return;
    }
    hidepunc=false;
    const {x,y}=e.detail;
    const [cx,cy]=getCharXY(x,y);
    if (cx>=folioLines()!==cx<0) {
        onTapText('');
        return;
    }
    tapmark.set([ $activepb ,cx,cy ]);
    updateUrl($tapAddress)
    const ft=get(foliotext);
    let {choff,linetext}=ft.fromFolioPos($activepb,cx,cy);
    linetext=linetext.replace(/([。！？：、．；，「『（ ])/g,'　');
    const offtext=linetext.slice(0,choff)+CURSORMARK+linetext.slice(choff).replace(/　.+/,'');
    let [t]=parseOfftext(offtext);
    while(t.charAt(0)=='　') t=t.slice(1);
    while(t.charAt(t.length-1)=='　') t=t.slice(0,t.length-1);
    onTapText(t); 
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
            if (f2==f && parseInt(pb) !==parseInt(i)) {
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
    if (!get(audioid)) {
        if ($mediaurls.length<2) return;
        const pick=  Math.floor(Math.random()*($mediaurls.length-1))+1;
        const vid= $preferaudio[$activefolioid] || $mediaurls[pick]?.vid;
        selectmedia(vid);
    } else {
        selectmedia('');
    }
}
$: console.log('activepb',$activepb)
$: loadZip(src);
//$: gotoPb($activepb); //trigger by goto folio in setting.svelte
</script>
<!-- svelte-ignore a11y-click-events-have-key-events -->
{#if ready}
<div class="swipe-holder" on:wheel={mousewheel} style={ "opacity:"+($leftmode!=='folio'?'0;':'1')+";width:"+folioHolderWidth($landscape,1,swiper)}>
<Swipe bind:this={swiper} {...swipeConfig} {defaultIndex}
 on:click={onfoliopageclick} on:start={swipeStart} on:change={swipeChanged}>
    {#each images as image,idx}
    <SwipeItem><img alt='no' class="swipe"  src={images[images.length-idx-1]}/></SwipeItem>
    {/each}    
</Swipe>
</div>
{:else}
<DownloadStatus msg={$downloading}/>
{/if}
{#if !$landscape}
{#key favoritetimer}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<span class:blinkfavorbtn={!!favoritetimer} class="favoritebtn" on:click={favoritebtn}>{ favortypes[$favorites[$activefolioid]?.[$activepb]||0]}</span>
{/key}
{/if}
{#if !$landscape  && $mediaurls.filter(it=>it.incache).length}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<span class="playbtn" on:click={toggleplaybtn}>{$audioid?'◼':'♫'}</span>
{/if}

<span class="pagenumber">{totalpages-defaultIndex}</span>
{#if $playing}
<span class="remainrollback">{$remainrollback>0?$remainrollback:''}</span>
{/if}

{#key $tapmark+$activepb}
{#if ready&&!hidepunc && !$showpaiji && $leftmode=='folio'}
<TapMark mark={$tapmark} pb={$activepb} folioChars={$folioChars} 
folioLines={folioLines()} frame={imageFrame()} />
{/if}
{/key}

{#key puncs}
{#if !hidepunc}
{#if $showpunc=='on'&& $leftmode=='folio'}
<PuncLayer frame={imageFrame()} folioChars={$folioChars} folioLines={folioLines()} {puncs} />
{/if}
<TranscriptLayer frame={imageFrame()} {totalpages} folioLines={folioLines()} {swiper} {ptk} {foliopage}/>
{/if}
{/key}
<style>
img { height:100%}
.swipe-holder{
    height: 100%;
    /* width:100%; */
}
.swipe {position:absolute;}
</style>