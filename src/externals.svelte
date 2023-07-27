<script>
export let links=[]
</script>
{#each links as [caption,url]}
<a class="toctext" href="{url}" target="_new">{caption}</a>
{/each}
