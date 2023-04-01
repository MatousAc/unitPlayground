<script>
  import { onMount } from 'svelte'
  import { draggable } from '@neodrag/svelte'
  import { unitMacros, swallow } from '../js/stores'

  /// vars ///
  export let x, y, initVal
  let fragment
  let initPosition = { x:x, y:y }
  let dragBounds = "parent"
  let parent

  onMount(() => {
    fragment.setOptions({
      enablePopover: false,
      macros: unitMacros
    })

    unitMacros.subscribe(val => {
      fragment.setOptions({ macros: val })
    })
    fragment.value = initVal
    parent = fragment.parentNode
  })
  
  /// destruction f(x)s ///
  const suicide = () => {
    dragBounds = undefined
    parent.removeChild(fragment)
  }

  const destroyIfInTrash = e => {
    let trash = document.querySelector('.trashIcon')
    if (trash.matches(':hover')) {
      swallow({
        'component': 'Fragment',
        'offsetX': e.detail.offsetX,
        'offsetY': e.detail.offsetY-20,
        'value': fragment.value
      })
      suicide()
    }
  }

  const equationFromPosition = (x, y) => {
    let equations = document.querySelectorAll('.equation')
    let hoveredEquation = null
    equations.forEach(equation => {
      const { top, bottom, left, right } = equation.getBoundingClientRect()
      if (x >= left && x <= right && y >= top && y <= bottom) {
        hoveredEquation = equation
      }
    })
    return hoveredEquation
  }

  const getCenterXY = e => {
    let { top, left } = parent.getBoundingClientRect()
    let { height, width } = fragment.getBoundingClientRect()
    let x = e.detail.offsetX + left + (width / 2)
    let y = e.detail.offsetY + top + (height / 2)
    return { x, y }
  }

  const snapIfOverEquation = e => {
    let { x, y } = getCenterXY(e)
    // get the correct mathfield
    let equation = equationFromPosition(x, y)
    if (equation === null) return
    let row = equation.children[0]
    let left = row.children[0]
    // trigger event on it
    let event = new CustomEvent("fragmentDrop", {
      detail: {
        fragmentValue: fragment.value,
        x: x,
        y: y
      }
    })
    left.dispatchEvent(event)
    suicide()
  }

  const drop = e => {
    destroyIfInTrash(e)
    snapIfOverEquation(e)
  }
</script>

<!-- svelte-ignore a11y-autofocus -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<math-field class=fragment
  bind:this={fragment}
  on:neodrag:end={drop}
  on:click|stopPropagation
  read-only
  draggable=true
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
.fragment {
  /* FIXME */
  user-select: none;
  
  width: fit-content;
  height: fit-content;
  
  position: absolute;
  padding: 0.2rem 0.3em;
  border-radius: 0.5rem;
  transition: border, background-color 0.5s;
  border: 3px solid #cddef2;
  background-color: white;
}

:global(.fragment.dragging) {
  border-color: transparent;
  background-color: transparent;
}
</style>