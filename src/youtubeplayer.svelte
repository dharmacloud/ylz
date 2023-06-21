<script>
import {player,mediaid,activefolio,folioLines,playing,continueplay} from './store.js'
import {mediaurls} from './mediaurls.js';

let plyr;
setTimeout(()=>{
    pylr=new YT.Player('player', {
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
    // console.log('create youtube player',pylr)
},1000);

function onPlayerStateChange(e){
    playing.set(false);
    if (e.data==1) { //start play
        playing.set(true);
    }
}
function onPlayerReady(e) {
    // 為確保瀏覽器上可以自動播放，要把影片調成靜音
    // console.log('player ready')
    player.set(pylr)
    pylr.playVideo();
    // setTimeout(async ()=>{
    //      e.target.pauseVideo();
    // },1000);
}
const loadVideo=(mediaid)=>{
    const {youtube,start} = mediaurls[mediaid];
    // console.log('load video',youtube);
    $player?.loadVideoById({'videoId':youtube,suggestedQuality:'low',startSeconds:start});
   //workaround with dash id
}
const seekToFolio=(folio,mediaid)=>{
    if (!mediaid || $continueplay) return;
    const {timestamp} = mediaurls[mediaid];
    if (!timestamp) return;
    const line=parseInt(folio)*$folioLines;
    const t=timestamp[line];
    $player?.seekTo(t);
}

$: seekToFolio($activefolio,$mediaid);
$: if (document.location.protocol!=='file:') loadVideo($mediaid)
</script>

<div id="player"></div>
<style>
    #player { position:absolute;right:-1px;height:1px}
</style>

