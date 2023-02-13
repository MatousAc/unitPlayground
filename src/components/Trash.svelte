<script>
  import { vomit } from "../js/stores.js"

  let trash
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<span 
  bind:this={trash}
  class="material-symbols-outlined trashIcon"
  on:click|stopPropagation={() => vomit(trash.parentNode)}>
  delete
</span>

<style>
  .trashIcon {
    --scale: 8em;
    position: absolute;
    bottom: calc(var(--scale) * -1);
    right: calc(50% - var(--scale) - 0.5em);
    cursor: pointer;
    z-index: 2;
    transition-duration: 0.4s;
    border: 2px solid;
    color: var(--dangerClr);
    padding: var(--scale);
    padding-top: .2em;
    border-radius: 100%;
    transition-duration: 0.5s;
    transition-timing-function: ease-in-out;
  }

  .trashIcon:hover {
    filter: brightness(85%);
  }

  .trashIcon:has(~ .equation.dragging) {
    padding-top: calc(.04 * var(--scale));
    font-size: 2em;
  }

:global(.trashIcon:hover ~ .equation.dragging) {
  border-color: var(--dangerClr) !important;
  color: var(--dangerClr) !important;
}
</style>