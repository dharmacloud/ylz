<script>
  import { createEventDispatcher } from "svelte";
  import Thumb from "./thumb.svelte"; 

  const dispatch = createEventDispatcher();

  let name = [];
  let range = false;
  let min = 0;
  let max = 100;
  let step = 1;
  let value = [min, max];
  let pos;
  let active = false;
  let order = false;

  function setValue(pos) {
    const offset = min % step;
    const width = max - min
    value = pos
      .map(v => min + v * width)
      .map(v => Math.round((v - offset) / step) * step + offset);
    dispatch("input", value);
  }

  function setPos(value) {
    pos = value
      .map(v => Math.min(Math.max(v, min), max))
      .map(v => (v - min) / (max - min));
  }

  function checkPos(pos) {
    return [Math.min(...pos), Math.max(...pos)];
  }

  export { name, range, min, max, step, value, order };

  $: if (active) setValue(pos);
  $: if (!active) setPos(value);
  $: if (range && order && active) pos = checkPos(pos);
  $: min, max, clamp();
  $: progress = `
    left: ${range ? Math.min(pos[0], pos[1]) * 100 : 0}%;
    right: ${100 - Math.max(pos[0], (range ? pos[1] : pos[0])) * 100}%;
  `;

 

  function clamp() {
    setPos(value);
    setValue(pos);
  }
</script>

<style>
  input {
    display: none;
  }

</style>

<input type="number" value={value[0]} name={name[0]} />
<div class="track">
  <div
    class="progress"
    style={progress} />
  <Thumb bind:pos={pos[0]} on:active={({ detail: v }) => active = v}>
    <slot name="left">
      <slot>
        <div class="thumb" />
      </slot>
    </slot>
  </Thumb>
</div>