<script>
  import { draggable } from "@neodrag/svelte"
  import Input from "./Input.svelte"
  import Result from "./Result.svelte"
  import Row from "./Row.svelte"
  import {writable} from 'svelte/store';
  import {onDestroy, setContext} from 'svelte';
  import { eqKey } from "../js/equation.js"

  let eqVal = writable({
    left: '',
    right: ''
  });

  setContext(eqKey, eqVal);
  let handleClick = () => {};
  
  let equation;
  export let x, y
  let initPosition = {
    x:x - 10, y:y - 25
  }

  let destroyIfEmpty = () => {
    let row = equation.children[0];
    let mfs = row.children;
    if (mfs[0].value == '' && mfs[1].value == '') {
      equation.parentNode.removeChild(equation);
    }
  }

  onDestroy(() => {}) // nothing currently
  let input, result;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div 
bind:this={equation}
on:click|stopPropagation={handleClick}
on:blur={destroyIfEmpty}
class="equation fitContent"
use:draggable={{
  bounds: 'parent',
  cancel: '.noDrag',
  defaultClass: 'draggable',
  defaultClassDragging: 'dragging',
  defaultClassDragged: 'dragged',
  position: initPosition
}}>
  <Row>
    <Input on:blur={destroyIfEmpty}/>
    <Result on:blur={destroyIfEmpty}/>
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

.equation:hover {
  border-color: var(--textClr);
}
</style>