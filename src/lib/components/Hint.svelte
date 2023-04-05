<script>
import { onMount } from 'svelte'
import { fade } from 'svelte/transition'
export let x = 2.8
export let message = '"ft" and "kg" cannot be added together'
export let color = 'red'

let visible = false

function toggle() {
  visible = !visible
}

onMount(() => {
  const handle = document.querySelector('.hint-rect')
  handle.style.left = `${x}rem`
})
</script>

<div class="hint">
  {#if visible}
    <div transition:fade class="hint-message">
      {message}
    </div>
  {/if}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div class="hint-rect" style="background-color: {color};" on:click={toggle} />
</div>

<style>
.hint {
  position: absolute;
  bottom: 100%;
  width: fit-content;
  left: 0;
}

.hint-message {
  max-width: 85%;
  position: relative;
  bottom: 0.3rem;
  margin: 0 auto;
  padding: 0.2rem 0.5rem;
  border-radius: 0.2rem;
  background-color: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
}

.hint-rect {
  position: absolute;
  width: 3rem;
  height: 0.4rem;
  cursor: pointer;
  border-bottom-left-radius: 1rem;
  border-bottom-right-radius: 1rem;
}
</style>
