<script>
  import { unitMacros } from '../js/stores'
  import { draggable } from '@neodrag/svelte'
  import { onMount } from 'svelte'
  import { swallow } from '../js/stores'
	import Equation from './Equation.svelte';

  // define some internal values
  let piece
  export let x, y, initVal
  let initPosition = { x:x, y:y }
  let dragBounds = "parent"

  onMount(() => {
    piece.setOptions({
      enablePopover: false,
      macros: unitMacros
    })

    
    unitMacros.subscribe(val => {
      piece.setOptions({ macros: val })
    })

    piece.value = initVal
  })
  
  // destruction f(x)s
  let selfDestruct = () => {
    // avoid getBoundingClientRect error
    dragBounds = undefined
    piece.parentNode.removeChild(piece)
  }

  let destroyIfInTrash = (e) => {
    let trash = document.querySelector('.trashIcon')
    if (trash.matches(':hover')) {
      swallow({
        'component': "Fragment",
        'offsetX': e.detail.offsetX,
        'offsetY': e.detail.offsetY-10,
        'value': piece.value
      })
      selfDestruct()
    }
  }
</script>

<!-- svelte-ignore a11y-autofocus -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<math-field class=piece
  bind:this={piece}
  on:neodrag:end={destroyIfInTrash}
  on:click|stopPropagation
  read-only
  use:draggable={{
    bounds: dragBounds,
    defaultClass: 'draggable',
    defaultClassDragging: 'dragging',
    defaultClassDragged: 'dragged',
    defaultPosition: initPosition,
    applyUserSelectHack: true
  }}
/>

<style>
.piece {
  /* FIXME */
  user-select: none;
  
  width: fit-content;
  height: fit-content;
  
  position: absolute;
  padding: 0.5em;
  border-radius: 1em;
  transition: border 0.5s;
  border: 2px solid transparent;
}

.piece:hover,
:global(.equation.dragging) {
  border-color: var(--textClr);
}
</style>