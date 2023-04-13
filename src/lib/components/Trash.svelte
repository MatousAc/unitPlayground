<script>
import { vomit } from '$pj/trash'

let trash
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<span
  bind:this={trash}
  class="material-symbols-rounded trashIcon"
  on:click|stopPropagation={vomit}
>
  delete
</span>

<style>
.trashIcon {
  --scale: 25rem;
  position: absolute;
  bottom: calc(var(--scale) * -1);
  right: calc(50% - var(--scale) - 0.5em);
  cursor: pointer;
  z-index: 2;
  transition-duration: 0.4s;
  border: 2px solid;
  color: var(--error);
  padding: var(--scale);
  padding-top: 0.2em;
  border-radius: 100%;
  transition-duration: 0.5s;
  transition-timing-function: ease-in-out;
}

.trashIcon:hover {
  filter: brightness(85%);
}

.trashIcon:has(~ .equation.dragging),
.trashIcon:has(~ .fragment.dragging) {
  padding-top: calc(0.07 * var(--scale));
  font-size: 2.5rem;
}

:global(.trashIcon:hover ~ .equation.dragging) {
  border-color: var(--error) !important;
  color: var(--error) !important;
}
</style>
