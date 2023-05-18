<script>
import  Swipe from './3rd/swipe.svelte';
import  SwipeItem  from "./3rd/swipeitem.svelte";
export let items=[];
const swipeConfig = {
  autoplay: false,
  delay: 2000,
//   showIndicators: true,
  transitionDuration: 1000,
  defaultIndex: items.length-1,
};
</script>

<style>
.swipe-holder{
  height: 100vh;
  width: auto;
}
img{
  width:auto;
  height: 93vh;
}
</style>

<div class="swipe-holder">
<Swipe {...swipeConfig}>
{#each items as item}
  <SwipeItem allow_infinite_swipe={true}>
    <img src={item} alt=""/>
  </SwipeItem>
{/each}
</Swipe>
</div>