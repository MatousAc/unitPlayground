<script>
// @ts-nocheck
import { fade } from 'svelte/transition'
import Button from '$pc/Button.svelte'
import Row from '$pc/Row.svelte'

let modal
export const close = () => modal.parentNode.removeChild(modal)

const handle_keydown = e => {
  if (e.key === 'Escape') {
    close()
    return
  }
}
</script>

<svelte:window on:keydown={handle_keydown} />

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div transition:fade class="modalBase" on:click={close} bind:this={modal}>
  <div on:click|stopPropagation class="modal" role="dialog" aria-modal="true">
    <Row justify="space-between">
      <div class="header">
        <slot name="header" />
      </div>
      <Button autofocus onClick={close} class="closeButton">
        <span class="material-symbols-rounded">close</span>
      </Button>
    </Row>
    <hr style="border-color: black;" />
    <slot name="body" />
    <div class="footer">
      <slot name="footer" />
    </div>
  </div>
</div>

<style>
.modalBase {
  position: absolute;
  z-index: 5;
  display: flex;
  width: 100%;
  height: 100%;
  background: #0000001c;
  justify-content: center;
  align-items: center;
  font-size: x-large;
}

.modal {
  background-color: white;
  padding: 2em 4em;
  max-width: 80%;
  border-radius: 0.5em;
  box-shadow: 0 0 10px 10px #0000000a;
}

:global(.closeButton) {
  position: relative;
  top: -1.5em;
  right: -1em;
  font-variation-settings: 'wght' 600;
}

.header {
  font-size: 1.5rem;
}

.footer {
  margin-top: 2rem;
}
</style>
