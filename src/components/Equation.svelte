<script>
  import { draggable } from '@neodrag/svelte'
  import Left from './Left.svelte'
  import Right from './Right.svelte'
  import Row from './Row.svelte'
  import { writable, get } from 'svelte/store';
  import { setContext } from 'svelte';
  import { eqKey } from '../js/equation'
  import { swallow } from '../js/stores'
  import MathInput from './MathInput.svelte'

  // define some internal values
  export let initLeft = ''
  let eqVal = writable({
    left: initLeft,
    right: ''
  });

  // a context for each equation
  setContext(eqKey, eqVal);
  
  let equation
  export let x, y
  let initPosition = {
    // make middle where equation was
    x:x - 15, y:y - 25
  }
  let dragBounds = "parent"

  // destruction f(x)s
  let selfDestruct = () => {
    // avoid getBoundingClientRect error
    dragBounds = undefined
    equation.parentNode.removeChild(equation)
  }

  let destroyIfEmpty = () => {
    let row = equation.children[0]
    let mfs = row.children
    if (mfs[0].value === '' && mfs[1].value === '') {
      // now remove yourself from the equation please
      selfDestruct()
    }
  }

  let destroyIfInTrash = (e) => {
    let trash = document.querySelector('.trashIcon')
    if (trash.matches(':hover')) {
      swallow({
        'offsetX': e.detail.offsetX,
        'offsetY': e.detail.offsetY-10,
        'value': get(eqVal).left
      })
      selfDestruct()
    }
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div 
bind:this={equation}
on:click|stopPropagation
on:blur={destroyIfEmpty}
on:neodrag:end={destroyIfInTrash}
class='equation fitContent'
use:draggable={{
  bounds: dragBounds,
  cancel: '.noDrag',
  defaultClass: 'draggable',
  defaultClassDragging: 'dragging',
  defaultClassDragged: 'dragged',
  defaultPosition: initPosition,
  applyUserSelectHack: true
}}>
  <Row>
    <MathInput on:blur={destroyIfEmpty}/>
    <Right on:blur={destroyIfEmpty}/>
  </Row>
</div>

<style>
.equation {
  position: absolute;
  padding: 0.5em 0.8em;
  border-radius: 1em;
  border: 2px solid transparent;
  transition: border 0.5s;
  border-color: var(--textClrFaded);
}

.equation:hover,
:global(.equation.dragging) {
  border-color: var(--textClr);
}
</style>