<script>
export let src;
let mp4player;
let touching=-1;
let touchx=0,touchy=0,startx=0,starty=0,direction=0;
import {up1,up2,turnleft,turnright,swipenext,swipeprev,swipestart,swipeend,down1,down2} from './swipeshapes.js';
import {fetchFolioText,getConreatePos} from 'ptk'
const swipeshapes=[ down2,down1, swipeend,turnright, , turnleft,swipestart, up1,up2];
export let ptk,folioChars=17,folioLines=5;
export let onDict=function(){};
const ontouchstart=(e)=>{
    direction=0;
	if (e.touches.length==1){
		startx=e.touches[0].pageX;
		starty=e.touches[0].pageY;
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

    if (Math.abs(deltax)<20 && deltay>30) {
        return (deltay>200)?-4:-3;
    } else if (Math.abs(deltax)<20 && deltay<-30) {
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
    const cx=folioLines-Math.floor((x/(div.clientWidth-div.clientLeft))*folioLines)-1;
    const cy=Math.floor((y/(div.clientHeight-div.clientTop))*folioChars);
    return [cx,cy];
}
const onclick=async (e,_x,_y)=>{
    const x=_x||e.offsetX;
    const y=_y||e.offsetY;
    const [cx,cy]=getCharXY(mp4player, x,y);
    const [foliotext,from,to]=await fetchFolioText(ptk,"vcpp",1+Math.floor(mp4player.currentTime));
    const t=getConreatePos(foliotext[cx],cy,foliotext[cx+1]);
    await onDict(t);
}
const ontouchend=async e=>{
	if (touching!==-1 && direction!==0) {
		if (direction==1) mp4player.currentTime+=-1;
		else if (direction==2) mp4player.currentTime=0;
		else if (direction==-1) mp4player.currentTime+=1;
		else if (direction==-2) mp4player.currentTime=mp4player.duration;
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
<video bind:this={mp4player}>
    <source {src} type="video/webm"/>
</video>
</div>
<style>
.container {height:100%;width:100%}
video {height:100%;user-select: none; pointer-events: none;}
.swipe {position:absolute;margin-top:50%;left:40%}
.pagenumber {position:absolute ; bottom:1%;font-size: 200%;}
.sponsor {user-select:none;pointer-events:none;font-size:5vh;
position:absolute; color:red;opacity: 0.75; right:1.2em;top:65vh;writing-mode: vertical-lr}
</style>
