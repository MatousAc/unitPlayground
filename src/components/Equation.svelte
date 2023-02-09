<script>
  import { draggable } from '@neodrag/svelte'
  import Input from './Input.svelte'
  import Result from './Result.svelte'
  import Row from './Row.svelte'
  import { writable, get } from 'svelte/store';
  import { onDestroy, setContext } from 'svelte';
  import { eqKey } from '../js/unitmath.js'
  import { swallow } from '../js/stores.js'

  export let initLeft = ''
  let eqVal = writable({
    left: initLeft,
    right: ''
  });

  setContext(eqKey, eqVal);
  
  let equation
  export let x, y
  let initPosition = {
    x:x - 15, y:y - 25
  }

  let selfDestruct = () => {
    equation.closest('.playground').removeChild(equation)
  }

  let destroyIfEmpty = () => {
    let row = equation.children[0];
    let mfs = row.children;
    if (mfs[0].value == '' && mfs[1].value == '') {
      selfDestruct()
      console.log("destroyed empty eq")
    }
  }

  let destroyIfInTrash = (e) => {
    console.log("eq", equation)
    console.log("e", e)
    let trash = document.querySelector('.trashIcon')
    if (trash.matches(':hover')) {
      swallow({
        'offsetX': e.detail.offsetX,
        'offsetY': e.detail.offsetY-10,
        'value': get(eqVal).left
      })
      // swallow(equation)
      console.log("about to self destruct")
      selfDestruct()
    }
  }

  onDestroy(() => {

  })
  // on:blur={destroyIfEmpty}

</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div 
bind:this={equation}
on:click|stopPropagation
on:blur={console.log("blurred", equation)}
on:neodrag:end={destroyIfInTrash}
class='equation fitContent'
use:draggable={{
  bounds: 'parent',
  cancel: '.noDrag',
  defaultClass: 'draggable',
  defaultClassDragging: 'dragging',
  defaultClassDragged: 'dragged',
  defaultPosition: initPosition
}}>
  <Row on:message>
    <Input on:message/>
    <Result on:message/>
  </Row>
</div>

<style>
.equation {
  position: absolute;
  padding: 0.5em 0.8em;
  border-radius: 1em;
  border: 2px solid transparent;
  transition: border 0.5s;
}

.equation:hover,
:global(.equation.dragging) {
  border-color: var(--textClr);
}
</style>