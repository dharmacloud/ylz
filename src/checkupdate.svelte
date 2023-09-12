<script>
import {ptks,tosim,hasupdate} from './store.js'
import {onMount} from 'svelte'
import {isLatest,downloadToCache} from 'ptk/platform/downloader.js'
import {poolDel,openPtk,usePtk} from 'ptk'

import { CacheName } from './constant.js';
    import { _ } from './textout.js';
$: updatestatus=ptks.map(it=>[it, 'checking']);
let needupdate=ptks.length;
onMount(async ()=>{
    for (let i=0;i<ptks.length;i++) {
        const same=await isLatest(ptks[i]+'.ptk',CacheName);
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
    await openPtk(name,new Uint8Array(buf));
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
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<span class="clickable hyperlink needupdate" on:click={()=>updateptk(idx)}>
    {_('更新',$tosim)+ ptkname}</span>
{/if}
{/each}
{downloadmsg}
{#if !$hasupdate}{_("數據庫是最新版",$tosim)}{/if}
