<script>
import { _ } from "./textout.js";
import {activePtk} from "./store.js"
import {usePtk} from "ptk"
export let entries=[];
let wikipedia,fgdzd,dfb;
let nentry=0;
let src='',showing='';
const wikilink=entry=>"https://zh.wikipedia.org/w/index.php?action=render&title="+encodeURIComponent(entry);
const onelinelink=entry=>"https://buddhaspace.org/dict/index.php?keyword="+encodeURIComponent(entry);
const googlelink=entry=>"https://www.google.com/search?q="+encodeURIComponent(entry);
const baidulink=entry=>"https://www.baidu.com/s?wd="+encodeURIComponent(entry);
const setWikipedia=()=>{
    if (!entries[nentry]) nentry=0;
    const entry=entries[nentry][1];
    showing='wikipedia';
    src=wikilink(entry);
}
const setOneline=()=>{
    if (!entries[nentry]) nentry=0;
    const entry=entries[nentry][1];
    showing='oneline';
    src=onelinelink(entry);
}
const availableDict=(n)=>{
    if ( n>=entries.length) {
        n=0;
    }
    if (!entries[n]) return;
    const at=entries[n][2];
    const flag=usePtk($activePtk).columns.entries.dict[at];
    wikipedia=flag&1;
    fgdzd=flag&2;
    dfb=flag&4;
    if (fgdzd||dfb) setOneline();
    else if (wikipedia) setWikipedia();

}

$: availableDict(nentry,entries);

</script>
<div class="dictpopup bodytext">
{#if entries.length}
<span class="header">
{#each entries as [distance,entry],idx}
<span class:dictgroup={idx==nentry}>
<label><input  type='radio' bind:group={nentry} name='dict' value={idx}/>{entry}</label>
{#if idx==nentry}
{#if fgdzd||dfb}
{#if showing=='oneline'}
<a target=_new href={onelinelink(entry)}>一行</a>
{:else}
<button on:click={setOneline}>一行</button>
{/if}
{/if}
{#if wikipedia}
{#if showing=='wikipedia'}
<a target=_new href={wikilink(entry)}>維基</a>
{:else}
<button on:click={setWikipedia}>維基</button>
{/if}
{/if}
<a target=_new href={googlelink(entry)}>谷哥</a>
<a target=_new href={baidulink(entry)}>百度</a>
{/if}
</span>
{/each}
</span>

{#if src}
<iframe style="border:none" class="iframe" title="wiki" {src}></iframe>
{/if}
{:else}
{_("點要查的字詞。")}
{/if}
</div>
<style>
.dictpopup {height:100%;overflow:hidden;display:flex;flex-flow:column}
.iframe { flex: 1 1 auto;}
.header {flex: 0 1 auto;}
</style>