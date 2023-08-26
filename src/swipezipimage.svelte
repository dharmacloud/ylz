<script>
import TranscriptLayer from './transcriptlayer.svelte';
import PuncLayer from './punclayer.svelte';
import TapMark from './tapmark.svelte';
//import Swipe from './newswiper.svelte'
import Swipe from './3rd/swipe.svelte';
import SwipeItem from './3rd/swipeitem.svelte';
import {downloadToCache} from 'ptk/platform/downloader.js'
import {extractPuncPos,usePtk,FolioText, parseOfftext,updateUrl} from 'ptk'
import { CURSORMARK} from './nav.js';
import {ZipStore} from 'ptk/zip';
import DownloadStatus from './downloadstatus.svelte'
import {CacheName} from './constant.js'
import {thezip,favortypes, landscape,foliotext,folioLines,isSidePaiji,tapAddress,
    folioChars,activePtk,activefolioid,activepb,favorites,audioid,showpunc,
maxfolio,tapmark, playing, remainrollback, showyoutube,shareAddress,
idlecount,showpaiji,loadingzip, selectmedia, preferaudio,folioHolderWidth,leftmode,mediaurls, downloading, sharing} from './store.js'
import { get } from 'svelte/store';
import { fetchAudioList } from './mediaurls';

export let src;

let ptk=usePtk($activePtk)
let foliopage=[],puncs=[],ready,hidepunc=false;
export let totalpages=0;
export let onTapText=function(){};
const blankimage='frames/blank.png'
let swiper;
let defaultIndex=1;
let imageIndex=0;

let favoritetimer=0;
let imageFrame={};

const getImages=(idx)=>{
    const clss=["leftimage","middleimage","rightimage"];
    const cls=clss[idx];
    const imgs=document.getElementsByClassName(cls);
    return imgs;
}

const swipeConfig = {
    autoplay: false,
    delay: 0,
    showIndicators: false,
    transitionDuration: 250,
    allow_infinite_swipe:true,
};

const loadZip=async ()=>{
    ready=false;
    loadingzip.set(true);
    let host='folio/';
    const ftext=new FolioText(ptk);//fetchFolioText(ptk,$activefolioid);
    await ftext.load($activefolioid)
    foliotext.set(ftext);

    // const res=await fetch(host+src);
    
    const res=await downloadToCache(CacheName,host+src,msg=>{
        downloading.set(host+src+ " "+msg);
    });
    
    downloading.set('');
    const buf=await res.arrayBuffer();
    const zip=new ZipStore(buf);
    thezip.set(zip);

    totalpages=zip.files.length;
    imageIndex=parseInt($activepb)-1;
    if (imageIndex>=totalpages) imageIndex=0;
    ready=true;
    setTimeout(()=>{
        maxfolio.set(totalpages);
        loadingzip.set(false);
        setImages(imageIndex); 
        updateFolioText()
        fetchAudioList($activefolioid,mediaurls,$showyoutube=='on')
    },10);   
}
const swipeStart=(obj)=>{
    hidepunc=true;
}
let oldDefaultIndex=1;

const setImage=(imageidx,zip,idx)=>{
    if (!swiper) return;
    if (idx>=totalpages) idx=0;
    else if (idx<0) idx=totalpages-1;

    const imgs=getImages(imageidx);

    //need to see all clone
    for(let i=0;i<imgs.length;i++) {
        const blob=new Blob([zip.files[idx].content]);
        imgs[i].src=URL.createObjectURL(blob);
    }
    swiper.update()
}
const setImages=(idx)=>{
    if (!swiper) return;
    const zip=$thezip;

    let previdx=idx-1;
    if (previdx<0) previdx=totalpages-1;
    let nextidx=idx+1;
    if (nextidx>=totalpages) nextidx=0;

    setImage((defaultIndex+1)%3,zip,previdx);
    setImage(defaultIndex,zip,idx);
    setImage((defaultIndex+2)%3,zip,nextidx);
    swiper.update()
    imageIndex=idx;
    const img=document.getElementsByClassName('middleimage')[0];
    const height=img.clientHeight||imageFrame.height;
    const width=img.clientWidth||imageFrame.width||height*0.45; //some time width ==0
    imageFrame={left:0,top:0,width,height}; 
}
const swipeChanged=(obj)=>{
    if (!ready) return;
    const {active_item}=obj.detail;
    defaultIndex=active_item;
    let idx=imageIndex;
    const zip=$thezip;
    if (oldDefaultIndex==defaultIndex) {
        hidepunc=false;
        return;
    }
    //console.log( ((oldDefaultIndex+3) - defaultIndex)%3)
    if ( ((oldDefaultIndex+3) - defaultIndex)%3 ==1) { //next image
        idx++;
        if (idx>=totalpages) idx=0;
        setImage((oldDefaultIndex+1)%3,zip,idx+1); //change next image
    } else{ 
        idx--;           
        if (idx<0) idx=totalpages-1;
        setImage((oldDefaultIndex+2)%3,zip,idx-1); //change prev image
    }
    oldDefaultIndex=defaultIndex;
    imageIndex=idx;
    activepb.set((imageIndex+1).toString())
    swiper.update()    
    updateFolioText();
    useractive();
    confirmfavorite();    
}

const updateFolioText=()=>{
    hidepunc=true;
    foliopage=get(foliotext).folioPageText($activepb);
    foliopage=foliopage.join('\n').replace(/【[^】]+】/,'').split('\n')
    setTimeout(()=>{
        const fl=folioLines();
        hidepunc=false;
        puncs=extractPuncPos(foliopage,fl);
    },200); //wait until swiper stop
}
const useractive=(humanaction=false)=>{
    if (!isSidePaiji() || humanaction) {
        showpaiji.set(false);
        idlecount.set(0);
    }
}
const mousewheel=(e)=>{
    if ($leftmode!=='folio') return;
    if (!ready) return;
	if (e.ctrlKey ) return;
    hidepunc=true;
    pb=parseInt($activepb);
	if (e.deltaY>0) {
        pb++;
        if (pb>totalpages) pb=1;
        activepb.set(pb);
	} else {
        pb--;
        if (pb<1) pb=totalpages;
        activepb.set(pb)
	}
    useractive(true);
	e.preventDefault();
}
const getCharXY=(x,y)=>{
	const {left,top,width,height}=imageFrame;
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
    const oldmark=$tapmark
    const newmark=[ $activepb ,cx,cy ];
    if ( JSON.stringify(oldmark)==JSON.stringify(newmark)) {
        sharing.set(true);
        navigator.clipboard.writeText(shareAddress());
        onTapText('');
        return;
    } else {
        sharing.set(false)
        tapmark.set(newmark);
    }
    updateUrl(tapAddress());
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
    updateFolioText();
    setImages(parseInt(pb)-1);
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
    if ($activePtk!=='ylz') return;//only support chinese

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
        const vid= $preferaudio[$activefolioid] || $mediaurls[pick||1]?.vid;
        selectmedia(vid);
    } else {
        selectmedia('');
    }
}
$: loadZip(src);
$: gotoPb($activepb); //trigger by goto folio in setting.svelte
</script>
<!-- svelte-ignore a11y-click-events-have-key-events -->
{#if ready}
<div class="swipe-holder" on:wheel={mousewheel} style={ "opacity:"+($leftmode!=='folio'?'0;':'1')+";width:"+folioHolderWidth($landscape,1,swiper)}>
<Swipe bind:this={swiper} {...swipeConfig} {defaultIndex} 
 on:click={onfoliopageclick} on:start={swipeStart} on:change={swipeChanged}>
 <SwipeItem><img src={blankimage} alt='no' class="leftimage swipe"/></SwipeItem>
 <SwipeItem><img src={blankimage} alt='no' class="middleimage swipe"/></SwipeItem>
 <SwipeItem><img src={blankimage} alt='no' class="rightimage swipe"/></SwipeItem>
</Swipe>
</div>
{:else}
<DownloadStatus msg={$downloading}/>
{/if}
{#if !$landscape && totalpages-defaultIndex>1}
{#key favoritetimer}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<span class:blinkfavorbtn={!!favoritetimer} class="favoritebtn" on:click={favoritebtn}>{ favortypes[$favorites[$activefolioid]?.[$activepb]||0]}</span>
{/key}
{/if}
{#if !$landscape  && $mediaurls.filter(it=>it.incache).length}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<span class="playbtn" on:click={toggleplaybtn}>{$audioid?'◼':'♫'}</span>
{/if}

<span class="pagenumber">{imageIndex+1}</span>
{#if $playing}
<span class="remainrollback">{$remainrollback>0?$remainrollback:''}</span>
{/if}

{#key $tapmark+$activepb}
{#if ready&&!hidepunc && !$showpaiji && $leftmode=='folio'}
<TapMark mark={$tapmark} pb={$activepb} folioChars={$folioChars} 
folioLines={folioLines()} frame={imageFrame} />
{/if}
{/key}
  
{#key puncs}
{#if !hidepunc}
{#if $showpunc=='on'&& $leftmode=='folio'}
<PuncLayer frame={imageFrame} folioChars={$folioChars} folioLines={folioLines()} {puncs} />
{/if}
<TranscriptLayer frame={imageFrame} {totalpages} folioLines={folioLines()} {swiper} {ptk} {foliopage}/>
{/if}
{/key}
<style>
img {height:100%}
.swipe-holder{
    height: var(--doc-height);
    /* width:100%; */
}
.swipe {position:absolute;} 
</style>