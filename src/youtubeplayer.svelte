<script>
import {player,youtubeid,activebookid,activefolio,folioLines,playing,continueplay,findByYoutube} from './store.js'

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
},2000);

function onPlayerStateChange(e){
    const obj=findByYoutube($youtubeid);
    if (!obj) return;
    const {bookid}=obj;
    if (bookid!==$activebookid) {
        stopVideo();
        return;
    }
    playing.set(e.data==1);   
}
const stopVideo=()=>{
    // youtubeid.set('');
    $player?.stopVideo();
    playing.set(false);
}
function onPlayerReady(e) {
    // 為確保瀏覽器上可以自動播放，要把影片調成靜音
    // console.log('player ready')
    player.set(pylr)
    pylr.playVideo();
}
const loadVideo=()=>{
    const obj=findByYoutube($youtubeid);
    if (!obj) return;
    const {timestamp,bookid} = obj;
    if (bookid!==$activebookid) {
        stopVideo();
    } else {
        activefolio.set(0);
        const start=(timestamp&&timestamp[0])||0;
        $player?.loadVideoById({'videoId':$youtubeid,suggestedQuality:'low',startSeconds:start});

    }
    // console.log('load video',youtube);
    
   //workaround with dash id
}
const seekToFolio=(folio,youtubeid)=>{
    if (!youtubeid || $continueplay) return;
    const {timestamp,bookid} = findByYoutube(youtubeid);
    if (bookid!==$activebookid) {
        stopVideo();
    }

    if (!timestamp) return;
    const line=parseInt(folio)*$folioLines;
    const t=timestamp[line];
    $player?.seekTo(t);
}
$: console.log('youtubeid',$youtubeid)
$: seekToFolio($activefolio,$youtubeid);
$: if (document.location.protocol!=='file:') loadVideo($youtubeid)
</script>

<div id="player"></div>
<style>
    #player { position:absolute;right:-1px;height:1px}
</style>

