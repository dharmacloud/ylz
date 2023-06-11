<script>
export let def='',ptk;
import {parseOfftext} from 'ptk'

$: [text,tags]=parseOfftext(def);
$: rendertext= text.replace(/\[\[([^\]]+)\]\]/g,"<span class=refer>$1</span>");
$: e=tags.filter(it=>it.name=='e')[0];
let src='',showwiki=false;
export const gowikipedia=()=>{
    if (!e?.attrs.wiki) return ;
    src="https://zh.wikipedia.org/zh-tw/"+ (e?.attrs.wiki!=='true'?e?.attrs.wiki:e?.attrs.id);
    showwiki=true;
}
export const gorefer=async (e)=>{
    if (e.target.className!=='refer') return;
    let entry=e.target.innerText;
    const defs=await ptk.fetchAddress('e#'+entry);   
    def=defs.join('\n')
}
</script>
<div class="dictpopup">
{#if showwiki}
<iframe class="iframe" title="wiki" {src}></iframe>
{:else}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<span class="entry" on:click={gowikipedia} class:clickable={!!e?.attrs.wiki}>{e?.attrs.id}</span>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<span on:click={gorefer} class="text">{@html rendertext}</span>
{/if}
</div>
<style>
.dictpopup {height:90%}
.iframe {width:100%;height: 100%;}
.entry {font-size:7vh}
.text {font-size:5vh}

</style>