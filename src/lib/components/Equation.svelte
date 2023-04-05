<script>
import { setContext } from 'svelte'
import { writable, get } from 'svelte/store'
import { draggable } from '@neodrag/svelte'
import { eqKey } from '$pj/equation'
import { swallow } from '$pj/trash'
import { logUserActivity } from '$pj/dataCollection'
import { isAuthed } from '$pj/auth'
import Hint from '$pc/Hint.svelte'
import Left from '$pc/Left.svelte'
import Right from '$pc/Right.svelte'
import Row from '$pc/Row.svelte'

/// data-passing vars ///
// each equation has a separate context
export let initVal = ''
const l = writable(initVal)
const r = writable('')
setContext(eqKey, { l, r })
export let x, y
let initPosition = {
  // place center of eq on user's click
  x: x - 20,
  y: y - 25
}
// internal vars
let equation,
  showHint = false
let dragBounds = 'parent'

/// destruction f(x)s ///
const suicide = () => {
  // avoid neodrag bounds error
  dragBounds = undefined
  equation.parentNode.removeChild(equation)
}

const isEmpty = () => {
  return get(l).length === 0 && get(r).length === 0
}

const process = () => {
  if (isEmpty()) suicide()
  else if (isAuthed()) logUserActivity({ l, r })
}

const destroyIfInTrash = e => {
  let trash = document.querySelector('.trashIcon')
  if (trash.matches(':hover')) {
    swallow({
      component: 'Equation',
      offsetX: e.detail.offsetX,
      offsetY: e.detail.offsetY - 20,
      value: get(l)
    })
    suicide()
  }
}

const handleKey = e => {
  if (e.keyCode === 120) {
    showHint = !showHint
  }
}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  bind:this={equation}
  on:click|stopPropagation
  on:blur={process}
  on:neodrag:end={destroyIfInTrash}
  on:keydown={handleKey}
  class="equation"
  use:draggable={{
    bounds: dragBounds,
    cancel: '.noDrag',
    defaultClass: 'draggable',
    defaultClassDragging: 'dragging',
    defaultClassDragged: 'dragged',
    defaultPosition: initPosition,
    applyUserSelectHack: true
  }}
>
  <Row>
    <Left on:blur={process} />
    <Right on:blur={process} />
  </Row>
  {#if showHint}
    <Hint />
  {/if}
</div>

<style>
.equation {
  width: fit-content;
  height: fit-content;

  position: absolute;
  padding: 0.7em 1em;
  border-radius: 1em;
  border: 2px solid transparent;
  transition: border, background-color 0.5s;
  border-color: var(--textClrFaded);
  background-color: white;
}

.equation:hover,
:global(.equation.dragging) {
  border-color: var(--textClr);
  background-color: transparent;
}
</style>
