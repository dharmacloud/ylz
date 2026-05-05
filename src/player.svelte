<script>
import {timeline,player,setplayer,activepb,audioid,folioLines,continueplay,playing,activefolioid, stopAudio} from './store.js'
import {audiofolder} from './mediaurls.js'
let audioplayer;
$: setplayer(audioplayer)

const seekToPb=(pbid,id)=>{
    if (!id || $continueplay || !$playing) return;
    const {folio,timestamps}=$timeline;
    if (!timestamps) return;
    if (folio!==$activefolioid) {
        stopAudio();
    }
    const timestampline=timestamps[(parseInt(pbid)-1)]||[];
    const t=timestampline[0]||-1;
    setTimeout(()=>{ //allow audio to initialized
        if (player) player.currentTime=t;
    },100)
}
$: seekToPb($activepb,$audioid);
</script>
{#key $audioid}
<audio bind:this={audioplayer}>
    {#if $audioid}<source src={audiofolder+$audioid.replace(/\^\d+$/,'')+'.mp3'}/>{/if}
</audio>
{/key}