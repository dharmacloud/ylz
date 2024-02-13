<script>
import {parseOfftext} from 'ptk'
// import QRCode from 'qrcode/lib/index.js'
import {shareAddress, foliotext,tapmark,tosim} from './store.js'
import {_} from './textout.js'
import { onMount } from 'svelte';
/* TODO  add more sentence */ 
const copylinkmsg='已複製連結到剪貼薄'
let qrcode='',linetext,title='',caption='',msg=copylinkmsg;

onMount(async()=>{
    const cl=$foliotext.fromFolioPos($tapmark);
    linetext=parseOfftext(cl?.linetext||'')[0];
    title=cl?.ck.bk.heading||'';
    caption=cl?.ck.caption;
    // qrcode=await QRCode.toString( shareAddress(),{type:'svg'});
});
let timer;
const showmessage=(_msg)=>{
    msg=_msg;
    clearTimeout(timer);
}
const excerptcopy=async ()=>{
    const text=shareAddress()+'\t「'+linetext+'」《'+title+'》'+caption;
    await navigator.clipboard.writeText(text);
    showmessage('已複製經文及連結到剪貼薄');
}
const copylink=async()=>{
    navigator.clipboard.writeText(shareAddress());
    showmessage(copylinkmsg);
}
const markdowncopy=async ()=>{
    const text='['+linetext+'《'+title+'》'+caption+']('+shareAddress()+')';
    await navigator.clipboard.writeText(text);
    showmessage('已複製Markdown格式到剪貼薄');
}
const htmlcopy=async ()=>{
    const text=linetext+'<a href="'+shareAddress()+'">《'+title+'》'+caption+'</a>';
    await navigator.clipboard.writeText(text);
    showmessage('已複製HTML格式到剪貼薄');
}
</script>

<div class="bodytext">{_(msg)}<br/>{_(linetext)}《{_(title)}》{_(caption)}</div>
<button on:click={copylink}>{_("複製連結")}</button>
<button on:click={excerptcopy}>{_("複製經文及連結")}</button>
<button on:click={htmlcopy}>{_("HTML格式連結")}</button>
<button on:click={markdowncopy}>{_("MarkDown格式連結")}</button>
<span>{@html qrcode}</span>
{shareAddress()}
<style>
button {font-size:1.5em}
</style>
