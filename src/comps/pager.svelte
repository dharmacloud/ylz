<script>
export let pages=[];
export let now=0;
export let previtems=1;
export let nextitems=3;
let left=now-previtems;
let right=now+nextitems+1;
const neighbors=[];
let last=null;
const makeNeighbors=()=>{
    now=parseInt(now);
    left=now-previtems;
    right=now+nextitems+1;
    if (left<2) left=1;
    if (right>=pages.length) right=pages.length-1;
    neighbors.length=0;

    for (let j=left;j<right;j++) {
        neighbors.push( pages[j])
    }
    right+=10;
    if (right<pages.length-2) neighbors.push(pages[right]);
    right+=30;
    if (right<pages.length-2) neighbors.push(pages[right]);
    
    if (pages.length) last=pages[pages.length-1];
    else last=null;
}
$:makeNeighbors(now,pages);
</script>
{#if pages.length}
<slot active={pages[0].idx==now} caption={pages[0].caption} idx=0 id={pages[0].id}></slot>
{/if}
{#each neighbors as page}
<slot active={page.idx==now} caption={page.caption+' '} idx={page.idx} id={page.id}></slot>
{/each}

{#if last}
<slot active={last.idx==now} caption={last.caption} idx={last.idx} id={last.id}></slot>
{/if}