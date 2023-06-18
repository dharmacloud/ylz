<script>
import {onMount} from 'svelte';
import PuncLayer from './punclayer.svelte';
import Swipe from './3rd/swipe.svelte';
import SwipeItem from './3rd/swipeitem.svelte';
export let src;
import {fetchFolioText,getConreatePos,folio2ChunkLine,extractPuncPos,usePtk} from 'ptk'
import {ZipStore} from 'ptk/zip';
import {activePtk,activebookid,activefolio,autoplay,maxfolio} from './store.js'
let ptk=usePtk($activePtk)
let foliotext='',foliofrom=0,puncs=[],ready,images=[],hidepunc=false;
export let folioChars=17,folioLines=5,totalpages=0,swiper;
export let onTapText=function(){};

const imageFrame=()=>{
    const img=document.getElementsByClassName('swipe')[defaultIndex];
	if (!img || !img.clientHeight) return [0,0,0,0];
    
	const r=img.clientHeight / img.naturalHeight;
    const rect=img.getBoundingClientRect();
	const w=img.naturalWidth * r;
	const left=Math.floor((img.clientWidth- w)/2) + rect.x;
	return {left,top:rect.y,width:w,height:img.clientHeight} ;
}
let defaultIndex=0;
const swipeConfig = {
    autoplay: false,
    delay: 0,
    showIndicators: false,
    transitionDuration: 250
};

const loadZip=async ()=>{
    const res=await fetch(src);
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
        ready=true;
    },1);   
}
const swipeStart=(obj)=>{
    hidepunc=true;
}
const swipeChanged=(obj)=>{
    const {swipe_direction,active_item}=obj.detail;
    defaultIndex=active_item;
    activefolio.set(totalpages- defaultIndex-1);
    updateFolioText();
}
const updateFolioText=async ()=>{
    hidepunc=false;
    [foliotext,foliofrom]=await fetchFolioText(ptk,$activebookid,1+Math.floor($activefolio));
	puncs=extractPuncPos(foliotext,folioLines);
}
const mousewheel=(e)=>{
	if (e.ctrlKey) return;
    hidepunc=true;
	if (e.deltaY>0) {
		swiper.prevItem();
	} else {
        swiper.nextItem();
	}
	e.preventDefault();
}
const getCharXY=(x,y)=>{
	const {left,top,width,height}=imageFrame();
    x-=left;
    y-=top;	
    const cx=folioLines-Math.floor((x/width)*folioLines)-1;
    const cy=Math.floor((y/height)*folioChars);
    return [cx,cy];
}

const onclick=async (e)=>{
    hidepunc=false;
    const {x,y}=e.detail;
    const [cx,cy]=getCharXY(x,y);
    // console.log('click',cx,cy)
    const [t,pos]=getConreatePos(foliotext[cx],cy,foliotext[cx+1]);
	//get the ck-lineoff 
    const ck=await folio2ChunkLine(ptk,foliotext, foliofrom,cx,pos);;
	const address= 'bk#'+$activebookid + (ck?('.'+ ck):'') ;
	await onTapText(t,address,ptk.name); 
}
const gotofolio=(folio)=>{
    if (!totalpages || !swiper)return;//not loaded yet
    const go=totalpages-folio-1;
    if (go!==defaultIndex) {
        // console.log('goto',folio, go, defaultIndex)
        swiper.goTo(go)
    }
}
$: loadZip(src);
$: gotofolio($activefolio); //trigger by goto folio in setting.svelte
let seconds=0;
onMount(()=>{
	timer=setInterval(()=>{
		if ($autoplay && seconds>$autoplay) {
            if (defaultIndex==0) { //last page
                swiper.goTo(totalpages-1); //goback to first page
            } else {
                swiper.prevItem();
            }
			seconds=0;
		}
		seconds++;
	},1000);
})

</script>
<!-- svelte-ignore a11y-click-events-have-key-events -->
{#if ready}
{#if defaultIndex==totalpages-1 && !hidepunc}
<div class="sponsor">中部全國供佛齋僧大會</div>
{/if}
<div class="swipe-holder" on:wheel={mousewheel} >
<Swipe bind:this={swiper} {...swipeConfig} {defaultIndex} on:click={onclick} on:start={swipeStart} on:change={swipeChanged}>
    {#each images as image,idx}
    <SwipeItem><img alt='no' class="swipe" src={images[images.length-idx-1]}/></SwipeItem>
    {/each}    
</Swipe>
</div>
{/if}
<span class="pagenumber">{totalpages-defaultIndex}</span>

{#key puncs}
{#if !hidepunc}
<PuncLayer frame={ imageFrame()  } {folioChars} {folioLines} {puncs} />
{/if}
{/key}


<style>
img { height:100%}
.pagenumber {position:absolute ; bottom:1%;font-size: 200%;left:0.1em;z-index: 999;color:brown}
.swipe {position:absolute;top:50%;left:50%;transform: translate(-50%,-50%); }
.swipe-holder{
    height: 100%;
    width: 100%; 
    background-color: rgb(243, 208, 160);
}
.sponsor {user-select:none;pointer-events:none;font-size:4vh;font-weight: bold;z-index:10;
position:absolute; color:red;opacity: 0.75; right:1.1em;top:50vh;writing-mode: vertical-lr}
</style>