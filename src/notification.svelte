<script>
import {notificationmessage} from './store.js'
let msg='',timer;
const shownotification=_msg=>{
    msg=_msg;
    clearTimeout(timer);
    timer=setTimeout(()=>{
        msg='';
    },4000)
}
$: shownotification($notificationmessage);
</script>

{#if msg}
<div class="notification">{msg}</div>
{/if}
