<script>
import { onMount } from 'svelte';
import {ytplayer,qqplayer,player,videoid,activefolioid,
    activepb,folioLines,playing,continueplay,stopVideo,findByVideoId} from './store.js'
import {mediabyid} from './mediaurls.js'
let timer;
const createYoutubePlayer=()=>{
    const plyr=new YT.Player('ytplayer', {
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
    ytplayer.set(plyr)
};
const createTencentPlayer=()=>{
    // https://m.v.qq.com/txp/v3/src/jsapi/
    const plyr = new Txplayer({
        containerId: 'qqplayer',
        vid: '',//make it invalid, otherwise might play ads,
        width: '1px',
        height: '1px',
        autoplay:false,
    });
    plyr.on('ready',onPlayerReady);
    plyr.on('playStateChange',onPlayerStateChange);
    qqplayer.set(plyr);
}

onMount(()=>{
    timer=setInterval(()=>{
        if (typeof Txplayer!=='undefined') {
            console.log('qq player ok')
            clearInterval(timer);
            createTencentPlayer();
        }
        if (typeof YT!=='undefined') {
            console.log('youtube player ok')
            clearInterval(timer);
            createYoutubePlayer();
        }
    },1500);
});

function onPlayerStateChange(e){
    console.log('player state change')
    if (e.data==-1 || e.data==5) return;
    const obj=findByVideoId($videoid);
    if (!obj) return;
    const {bookid}=obj;

    if (bookid!==$activefolioid) {
        // activepb.set(0);
        stopVideo();
        return;
    }
    playing.set(e.data==1 || e.state==1);
}

function onPlayerReady(e) {
    // 為確保瀏覽器上可以自動播放，要把影片調成靜音
    console.log('player ready')
    const plyr=player();
    if ($videoid) {
        plyr?.playVideo?plyr.playVideo():(plyr?.play&&plyr.play());
    }
}
const loadVideo=()=>{
    const vid=$videoid;
    const obj=findByVideoId(vid);
    stopVideo(); 
    if (!obj || !vid) return;

    //不同的卷共享一影片，id 必須後綴  ^ 。
    const validvid=vid.replace(/\^\d*$/,'')
    const {timestamp,bookid} = obj;
    if (bookid!==$activefolioid) {
        stopVideo();
    } else {
        // console.log('load',vid)
        activepb.set(0);
        const start=(timestamp&&timestamp[0])||0;
        const host=mediabyid(vid)?.videohost;
        console.log(host, player(vid))
        if (host=='youtube') {
            $ytplayer.loadVideoById({'videoId':validvid,suggestedQuality:'low',autoplay:true, startSeconds:start});
        } else {
            $qqplayer.play({vid:validvid,autoplay:true,playStartTime:start});
        }
    }
}
const seekToFolio=(folio,videoid)=>{
    if (!videoid || $continueplay || !$playing) return;
    const {timestamp,bookid} = findByVideoId(videoid);
    if (bookid!==$activefolioid) {
        stopVideo();
    }
    if (!timestamp) return;
    const line=parseInt(folio)*folioLines();
    const t=timestamp[line];
    player(videoid)?.seekTo(t);
}
$: seekToFolio($activepb,$videoid);
$: if (document.location.protocol!=='file:') loadVideo($videoid)
</script>

<div id="ytplayer"></div>
<div id="qqplayer"></div>
<style>
    #ytplayer { position:absolute;bottom:-1px;height:1px}
    #qqplayer { position:absolute;bottom:-1px;height:1px}
</style>