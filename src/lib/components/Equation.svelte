<script>
  import { draggable } from '@neodrag/svelte'
  import Left from './Left.svelte'
  import Right from './Right.svelte'
  import Row from './Row.svelte'
  import { writable, get } from 'svelte/store';
  import { onMount, setContext } from 'svelte';
  import { eqKey } from '../js/equation'
  import { swallow } from '../js/stores'

  // define some internal values
  export let initVal = ''
  let eqVal = writable({
    left: initVal,
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
  const suicide = () => {
    // avoid getBoundingClientRect error
    dragBounds = undefined
    equation.parentNode.removeChild(equation)
  }

  const destroyIfEmpty = () => {
    let row = equation.children[0]
    let mfs = row.children
    if (mfs[0].value === '' && mfs[1].value === '') {
      // now remove yourself from the equation please
      suicide()
    }
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

  // hover class
  let hover = false

  const insertFragment = event => {
    console.log("Fragment drop!")
    console.log(event)
    console.log(event.detail.fragmentValue)
    console.log(event.detail.x)
    console.log(event.detail.y)
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div 
bind:this={equation}
on:click|stopPropagation
on:blur={destroyIfEmpty}
on:neodrag:end={destroyIfInTrash}
on:mouseenter={() => hover = true}
on:mouseleave={() => hover = false}
on:fragmentDrop={insertFragment}
class='equation{hover ? " hover" : ''}'
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

/* for fragment hovering */
.equation.hover:has(~ .fragment.dragging) {
  font-size: 1.3em;
}
</style>