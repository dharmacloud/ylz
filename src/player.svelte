<script>
import {player,setplayer,activepb,audioid,folioLines,continueplay,playing,activefolioid, stopAudio,findByAudioId} from './store.js'
import {audiofolder} from './mediaurls.js'
let audioplayer;
$: setplayer(audioplayer)

const seekToPb=(pbid,audioid)=>{
    if (!audioid || $continueplay || !$playing) return;
    const {timestamp,bookid} = findByAudioId(audioid);
    if (bookid!==$activefolioid) {
        stopAudio();
    }
    if (!timestamp) return;
    const line=(parseInt(pbid)-1)*folioLines();
    const t=timestamp[line];
    if (player) player.currentTime=t;
}
$: seekToPb($activepb,$audioid);
</script>
{#key $audioid}
<audio bind:this={audioplayer}>
    {#if $audioid}<source src={audiofolder+$audioid+'.mp3'}/>{/if}
</audio>
{/key}