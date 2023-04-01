<script>
  import { writable, get } from 'svelte/store'
  import { setContext } from 'svelte'
  import { draggable } from '@neodrag/svelte'
  import { eqKey } from '../js/equation'
  import { swallow } from '../js/stores'
  import Left from './Left.svelte'
  import Right from './Right.svelte'
  import Row from './Row.svelte'

  /// data-passing vars ///
  export let initVal = ''
  let eqVal = writable({
    left: initVal,
    right: ''
  })
  export let x, y
  let initPosition = {
    // place center of eq on user's click 
    x:x - 20, y:y - 25
  }
  // each equation has a separate context
  setContext(eqKey, eqVal)
  // internal vars
  let equation
  let dragBounds = "parent"

  /// destruction f(x)s ///
  const suicide = () => {
    // avoid neodrag bounds error
    dragBounds = undefined
    equation.parentNode.removeChild(equation)
  }

  const destroyIfEmpty = () => {
    let row = equation.children[0]
    let leftRight = row.children
    if (leftRight[0].value === '' && leftRight[1].value === '') suicide()
  }

  const destroyIfInTrash = e => {
    let trash = document.querySelector('.trashIcon')
    if (trash.matches(':hover')) {
      swallow({
        'component': 'Equation',
        'offsetX': e.detail.offsetX,
        'offsetY': e.detail.offsetY-20,
        'value': get(eqVal).left
      })
      suicide()
    }
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div 
bind:this={equation}
on:click|stopPropagation
on:blur={destroyIfEmpty}
on:neodrag:end={destroyIfInTrash}
class='equation'
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
    <Left on:blur={destroyIfEmpty}/>
    <Right on:blur={destroyIfEmpty}/>
  </Row>
</div>

<style>
.equation {
  width: fit-content;
  height: fit-content;
  
  position: absolute;
  padding: 0.7em 1em;
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