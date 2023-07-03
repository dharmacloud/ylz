<script>
import { onMount } from 'svelte';
import {videohost,player,videoid,activebookid,activefolio,folioLines,playing,continueplay,stopVideo,findByVideoId} from './store.js'
let plyr,timer;
const createYoutubePlayer=()=>{
    plyr=new YT.Player('player', {
    height: '1px', // 高度預設值為390，css會調成responsive
    // width: '640', // 寬度預設值為640，css會調成responsive
    videoId:'',
    host:'https://www.youtube.com',
    playerVars: {  controls: 0 ,disablekb:1, rel:0, origin:document.location.origin},
    events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
    }
    });
    player.set(plyr)
    // console.log('create youtube player',pylr)
};
const createTencentPlayer=()=>{
    // https://m.v.qq.com/txp/v3/src/jsapi/
    plyr = new Txplayer({
        containerId: 'player',
        vid: '',//make it invalid, otherwise might play ads,
        width: '1px',
        height: '1px',
        autoplay:false,
    });

    plyr.on('ready',onPlayerReady);
    plyr.on('playStateChange',onPlayerStateChange);
    player.set(plyr)
}

onMount(()=>{
    timer=setInterval(()=>{
        if (typeof Txplayer!=='undefined') {
            console.log('load tencent')
            clearInterval(timer);
            createTencentPlayer();
        }
        if (typeof YT!=='undefined') {
            console.log('load youtube')
            clearInterval(timer);
            createYoutubePlayer();
        }
    },1500);
});

function onPlayerStateChange(e){
    const obj=findByVideoId($videoid);
    if (!obj) return;
    const {bookid}=obj;

    if (bookid!==$activebookid) {
        // activefolio.set(0);
        stopVideo();
        return;
    }
    playing.set(e.data==1 || e.state==1);
}

function onPlayerReady(e) {
    // 為確保瀏覽器上可以自動播放，要把影片調成靜音
    // console.log('player ready')
    
    plyr.playVideo?plyr.playVideo():(plyr.play&&plyr.play());
}
const loadVideo=()=>{
    const obj=findByVideoId($videoid);
    if (!obj) {
        stopVideo();   
        return;
    }
    const {timestamp,bookid} = obj;
    if (bookid!==$activebookid) {
        stopVideo();
    } else {
        activefolio.set(0);
        const start=(timestamp&&timestamp[0])||0;
        if ($videohost=='youtube') {
            $player?.loadVideoById({'videoId':$videoid,suggestedQuality:'low',startSeconds:start});
        } else {
            $player?.play({vid:$videoid,autoplay:true,playStartTime:start});
        }
    }
}
const seekToFolio=(folio,videoid)=>{
    if (!videoid || $continueplay || !$playing) return;
    const {timestamp,bookid} = findByVideoId(videoid);
    if (bookid!==$activebookid) {
        stopVideo();
    }
    if (!timestamp) return;
    const line=parseInt(folio)*$folioLines;
    const t=timestamp[line];
    $player?.seekTo(t);
}
$: seekToFolio($activefolio,$videoid);
$: if (document.location.protocol!=='file:') loadVideo($videoid)
</script>

<div id="player"></div>
<style>
    #player { position:absolute;right:-1px;height:1px}
</style>