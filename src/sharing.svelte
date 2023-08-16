<script>
import {parseOfftext} from 'ptk'
import QRCode from 'qrcode'
import {shareAddress, foliotext,tapmark} from './store.js'
import { onMount } from 'svelte';
let qrcode='',linetext,title='',caption='';

onMount(async()=>{
    const cl=$foliotext.fromFolioPos($tapmark);
    linetext=parseOfftext(cl?.linetext||'')[0];
    title=cl?.ck.bk.heading||'';
    caption=cl?.ck.caption;
    qrcode=await QRCode.toString( shareAddress(),{type:'svg'});
});

</script>
<div class="toctext">此段經文網址已在剪貼薄<br/>{linetext}《{title}》{caption}</div>
<span>{@html qrcode}</span>
{shareAddress()}