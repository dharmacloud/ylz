<script>
import PuncLayer from './punclayer.svelte';
import {isAndroid} from './store.js'
export let src;
let mp4player;
let touching=-1;
let touchx=0,touchy=0,startx=0,starty=0,direction=0;
import {up1,up2,turnleft,turnright,swipestart,swipeend,down1,down2} from './swipeshapes.js';
import {fetchFolioText,getConcreatePos,folio2ChunkLine,extractPuncPos,usePtk} from 'ptk'
import {folioLines, folioChars,activebookid,activefolio,activePtk, maxfolio} from './store.js'
const swipeshapes=[ down2,down1, swipeend,turnright, , turnleft,swipestart, up1,up2];

export let onTapText=function(){};
export let onMainmenu=function(){};
let ptk=usePtk($activePtk)
let foliotext='',foliofrom=0,puncs=[];

const videoRect=()=>{
	if (!mp4player) return [0,0,0,0];
	const r=mp4player.clientHeight / mp4player.videoHeight;
	const w=mp4player.videoWidth * r;
	const left=Math.floor((mp4player.clientWidth- w)/2);
	const right= left + w ;
	return [left,0,right,mp4player.clientHeight] ;
}
const inVideoRect=(x)=>{
	const [left,top,right]=videoRect();
	return (x>left && x<right);
}

const ontouchstart=(e)=>{
    direction=0;
	if (e.touches.length==1){
		startx=e.touches[0].pageX;
		starty=e.touches[0].pageY;
		if (!inVideoRect(startx)) return;
		touchx=startx;
		touchy=starty;
        touching=1;
	}  
}

const getDirection=()=>{
	// if (Math.abs(touchy-starty)>30) return 0;
	const deltax=touchx-startx;
    const deltay=touchy-starty;
	const w=mp4player.videoWidth/2;
	if (deltax>30 && Math.abs(deltay)<Math.abs(deltax)/2 ) {
		return (deltax>w)?-2:-1;
	} else if (deltax<-30 && Math.abs(deltay)<Math.abs(deltax)/2) {
		return (deltax<-w) ?2:1;
	}

    if (Math.abs(deltax)<Math.abs(deltay)/2 && deltay>30) {
        return (deltay>w)?-4:-3;
    } else if (Math.abs(deltax)<Math.abs(deltay)/2 && deltay<-30) {
        return (deltay<-w) ?4:3;
    }
	return 0;
}
const ontouchmove=(e)=>{
	if (touching==-1)return;
	if (touching>-1) {
		touchx=e.touches[0].pageX;
		touchy=e.touches[0].pageY;
		direction=getDirection();
	}
}
const mousewheel=(e)=>{
	if (e.ctrlKey) return;
	if (e.deltaY>0) {
		mp4player.currentTime+=1;
	} else {
		mp4player.currentTime+=-1;
	}
	e.preventDefault();
	updateFolioText();
}
const getCharXY=(div,x,y)=>{
	const [left,top,right]=videoRect();
    const cx=$folioLines-Math.floor(((x-left)/(right-left))*$folioLines)-1;
    const cy=Math.floor((y/(div.clientHeight-div.clientTop))*$folioChars);
    return [cx,cy];
}


const onclick=async (e,_x,_y)=>{
    const x=_x||e.clientX;
    const y=_y||e.clientY;
	if (!inVideoRect(x)) return;
    const [cx,cy]=getCharXY(mp4player, x,y);
    const [t,pos]=getConcreatePos(foliotext[cx],cy,foliotext[cx+1]);
	//get the ck-lineoff 
	const address=  'bk#'+$activebookid +'.'+ await folio2ChunkLine(ptk,foliotext, foliofrom,cx,pos);
	await onTapText(t,address,ptk.name);
}

const ontouchend=async e=>{
	if (touching!==-1 && direction!==0) {
		if (direction==1) mp4player.currentTime+=-1.001;
		else if (direction==2) mp4player.currentTime=0;
		else if (direction==-1) mp4player.currentTime+=1.001;
		else if (direction==-2) mp4player.currentTime=mp4player.duration;
		else if (direction==3||direction==4) {
			onMainmenu();
		}
		updateFolioText();
	} else {
        // onclick(e,touchx,touchy);
    }
	touching=-1; 
	direction=0;
    
}
const updateFolioText=async ()=>{
    [foliotext,foliofrom]=await fetchFolioText(ptk,$activebookid,1+Math.floor(mp4player?.currentTime||0));
	puncs=extractPuncPos(foliotext,$folioLines);
	activefolio.set(Math.floor(mp4player.currentTime));
	if (!mp4player?.paused) mp4player?.pause();
}
const gotoFolio=async (t)=>{
	if (!mp4player?.paused) mp4player?.pause();
	if (Math.floor(t)!==Math.floor(mp4player?.currentTime)) {
		setTimeout(()=>{
			mp4player.currentTime=Math.floor(t||0)+0.01;
			updateFolioText();
		},500);
	} else {
		updateFolioText();
	}
}
$: gotoFolio($activefolio,$activebookid);
const videoFrame=()=>{
	const frame=videoRect();
	return {left:frame[0],top:frame[1],width:frame[2]-frame[0],height:frame[3]-frame[1]};
}
const videoloaded=()=>{
	gotoFolio($activefolio);
	maxfolio.set(mp4player.duration);
	mp4player.autoplay=false;
	mp4player.pause();
}
// let timer;
// let seconds=0;
// onMount(()=>{
// 	timer=setInterval(()=>{
// 		if ($autoplay && seconds>$autoplay) {
// 			autoplayfolio();
// 			seconds=0;
// 		}
// 		seconds++;

// 	},1000);
// })

// onDestroy(()=>{
// 	clearInterval(timer)
// })
const setHandle=node=>{
	mp4player=node;
}
</script>
{#if mp4player?.currentTime<1}
<div class="sponsor">中部全國供佛齋僧大會</div>
{/if}
<!-- svelte-ignore missing-declaration -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="container" 	on:touchstart|passive={ontouchstart}
	on:touchmove|passive={ontouchmove}
	on:touchend|passive={ontouchend}
	on:click={onclick}
    on:wheel={mousewheel}>
 {#if touching>-1 && direction}<span class="swipe">{@html swipeshapes[direction+4]}</span>{/if}

<span class="pagenumber">{1+Math.floor(mp4player?.currentTime)}</span>


{#key src}
<!-- svelte-ignore a11y-media-has-caption -->
<video loop autoplay on:loadeddata={videoloaded} use:setHandle>
	<source {src} type={"video/"+($isAndroid?"webm":"mp4")}/>
</video>
{/key}

{#key puncs}
<PuncLayer frame={ videoFrame()  } {folioChars} {folioLines} {puncs} />
{/key}

</div>
<style>
.container {width:100%;background-color: rgb(243, 208, 160);height: 100%;}
video { height:100%;user-select: none; pointer-events: none;width:100%;}
.swipe {position:absolute;top:50%;left:50%;transform: translate(-50%,-50%); }
.pagenumber {position:absolute ; bottom:1%;font-size: 200%;left:0.1em;z-index: 999;color:brown}

</style>
