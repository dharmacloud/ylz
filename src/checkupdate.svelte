<script>
import {tosim,hasupdate,allptks} from './store.js'
import {onMount} from 'svelte'
import {isLatest,downloadToCache} from 'ptk/platform/downloader.js'
import {enableAccelon23Features} from 'ptk/basket/features.ts'
import {poolDel,openPtk} from 'ptk'
import { CacheName } from './constant.js';
import { _ } from './textout.js';

let updatestatus=[];
let needupdate=0;
onMount(async ()=>{
    updatestatus= allptks.map(it=>[it, 'checking']);
    needupdate=allptks.length;
    for (let i=0;i<allptks.length;i++) {
        const same=await isLatest(allptks[i]+'.ptk',CacheName);
        updatestatus[i][1]=same?'':'hasupdate';
        if (same) needupdate--;
    }
    hasupdate.set(needupdate>0);
    updatestatus=updatestatus;
})

let downloading=false,downloadmsg='';
const updateptk=async idx=>{
    const name=updatestatus[idx][0];
    if (downloading)return;
    downloading=true;
    //append timestamp to url to force check 
    const res=await downloadToCache(CacheName,name+'.ptk?'+(new Date()).toISOString(),msg=>{
        downloadmsg=msg;
    });

    poolDel(name);
    const buf=await res.arrayBuffer();
    const ptk=await openPtk(name,new Uint8Array(buf));
    enableAccelon23Features(ptk);
    downloading=false;
    updatestatus[idx][1]='';
    updatestatus=updatestatus;
    downloadmsg='';
    needupdate--;
    hasupdate.set(needupdate>0);
}
</script>
{#each updatestatus as [ptkname,status],idx}
{#if status=='hasupdate'} 
<span aria-hidden="true" class="clickable hyperlink needupdate" on:click={()=>updateptk(idx)}>
    {_('更新',$tosim)+ ptkname}</span>
{/if}
{/each}
{downloadmsg}
{#if !$hasupdate}{_("數據庫是最新版",$tosim)}{/if}
