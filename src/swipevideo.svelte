<script>
export let src;
let mp4player;
let touching=-1;
let touchx=0,touchy=0,startx=0,starty=0,direction=0;
import {up1,up2,turnleft,turnright,swipenext,swipeprev,swipestart,swipeend,down1,down2} from './swipeshapes.js';
import {fetchFolioText,getConreatePos} from 'ptk'
import {activebookid} from './store.js'
const swipeshapes=[ down2,down1, swipeend,turnright, , turnleft,swipestart, up1,up2];
export let ptk,folioChars=17,folioLines=5;
export let onTapText=function(){};
export let onMainmenu=function(){};

const videoRect=()=>{
	const r=mp4player.clientHeight / mp4player.videoHeight;
	const w=mp4player.videoWidth * r;
	const left=(mp4player.clientWidth- w)/2;
	const right= left + w ;
	return [left,right] ;
}
const inVideoRect=(x)=>{
	const [left,right]=videoRect();
	return (x>left && x<right);
}
const videoLeft=()=>{
	return videoRect()[0];
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
	if (deltax>30 && Math.abs(deltay)<Math.abs(deltax)/2 ) {
		return (deltax>200)?-2:-1;
	} else if (deltax<-30 && Math.abs(deltay)<Math.abs(deltax)/2) {
		return (deltax<-200) ?2:1;
	}

    if (Math.abs(deltax)<Math.abs(deltay)/2 && deltay>30) {
        return (deltay>200)?-4:-3;
    } else if (Math.abs(deltax)<Math.abs(deltay)/2 && deltay<-30) {
        return (deltay<-200) ?4:3;
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
}
const getCharXY=(div,x,y)=>{
	const [left,right]=videoRect();
    const cx=folioLines-Math.floor(((x-left)/(right-left))*folioLines)-1;
    const cy=Math.floor((y/(div.clientHeight-div.clientTop))*folioChars);
    return [cx,cy];
}
const onclick=async (e,_x,_y)=>{
    const x=_x||e.offsetX;
    const y=_y||e.offsetY;
	if (!inVideoRect(x)) return;
	
    const [cx,cy]=getCharXY(mp4player, x,y);
    const [foliotext,from,to]=await fetchFolioText(ptk,$activebookid,1+Math.floor(mp4player.currentTime));
    const t=getConreatePos(foliotext[cx],cy,foliotext[cx+1]);
    await onTapText(t);
}
const ontouchend=async e=>{
	if (touching!==-1 && direction!==0) {
		if (direction==1) mp4player.currentTime+=-1.1;
		else if (direction==2) mp4player.currentTime=0;
		else if (direction==-1) mp4player.currentTime+=1.1;
		else if (direction==-2) mp4player.currentTime=mp4player.duration;
		else if (direction==3||direction==4) {
			onMainmenu();
		}
	} else {
        // onclick(e,touchx,touchy);
    }
	touching=-1; 
	direction=0;
    
}
</script>
{#if mp4player?.currentTime==0}
<div class="sponsor">中區供佛齋僧</div>
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
<!-- svelte-ignore a11y-media-has-caption -->
{#key src}
<video bind:this={mp4player}>
    <source {src} type="video/webm"/>
</video>
{/key}
</div>
<style>
.container {width:100%;background-color: rgb(243, 208, 160);height: 100%;}
video { height:100%;user-select: none; pointer-events: none;width:100%}
.swipe {position:absolute;margin-top:50%;left:40%}
.pagenumber {position:absolute ; bottom:1%;font-size: 200%;}
.sponsor {user-select:none;pointer-events:none;font-size:4vh;
position:absolute; color:red;opacity: 0.75; right:1.1em;top:65vh;writing-mode: vertical-lr}
</style>
