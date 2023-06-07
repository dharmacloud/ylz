<script>
export let def='';
import {parseOfftext} from 'ptk'

$: [text,tags]=parseOfftext(def);
$: e=tags.filter(it=>it.name=='e')[0];
let src='',showwiki=false;
export const gowikipedia=()=>{
    if (!e.attrs.wiki) return ;
    src="https://zh.wikipedia.org/zh-tw/"+ (e.attrs.wiki!=='true'?e.attrs.wiki:e.attrs.id);
    showwiki=true;
}
</script>
<div class="popup">
{#if showwiki}
<iframe class="iframe" title="wiki" {src}></iframe>
{:else}
<span class="entry" on:click={gowikipedia} class:clickable={!!e.attrs.wiki}>{e.attrs.id}</span>
{text}
{/if}
</div>
<style>
.iframe {width:100%;height: 100%;}
.entry {font-size:150%}
.popup {position:absolute;top:5%;left:5%;width:90%;height:90%;background:#dfdfdf}
.clickable {text-decoration: underline;}
</style>