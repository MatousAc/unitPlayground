<script>
  import { fade } from 'svelte/transition'
	import { createEventDispatcher, onDestroy } from 'svelte';
  import Button from './Button.svelte'
  import Row from './Row.svelte'

	const dispatch = createEventDispatcher();
	const close = () => modal.parentNode.removeChild(modal);

	let modal;

	const handle_keydown = e => {
		if (e.key === 'Escape') {
			close();
			return;
		}

		if (e.key === 'Tab') {
			// trap focus
			const nodes = modal.querySelectorAll('*');
			const tabbable = Array.from(nodes).filter(n => n.tabIndex >= 0);

			let index = tabbable.indexOf(document.activeElement);
			if (index === -1 && e.shiftKey) index = 0;

			index += tabbable.length + (e.shiftKey ? -1 : 1);
			index %= tabbable.length;

			tabbable[index].focus();
			e.preventDefault();
		}
	};

	const previously_focused = typeof document !== 'undefined' && document.activeElement;

	if (previously_focused) {
		onDestroy(() => {
			// @ts-ignore
			previously_focused.focus();
		});
	}
</script>

<svelte:window on:keydown={handle_keydown}/>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div transition:fade class='modalBase' on:click={close} bind:this={modal}>
  <div on:click|stopPropagation class='modal' role='dialog' aria-modal='true'>
    <Row justify='space-between'>
      <slot name='header'></slot>
      <Button autofocus onClick={close} class='closeButton'>
        <span class='material-symbols-rounded'>
          close
        </span>
      </Button>
    </Row>
  	<hr>
  	<slot></slot>
  	<hr>
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
}

.modal {
  background-color: white;
  padding: 2em;
  max-width: 60%;
  max-height: 80%;
  border-radius: 0.5em;
  box-shadow: 0 0 10px 10px #0000000a;
}

:global(.closeButton) {
  position: relative;
  top: -1.5em;
  right: -1em;
  font-variation-settings: 'wght' 600; 
}
</style>