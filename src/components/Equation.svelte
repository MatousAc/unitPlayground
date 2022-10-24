<script>
  import { draggable } from "@neodrag/svelte"
  import MathField from "./MathField.svelte"

  export let x, y
  let initPosition = {
    x:x - 10, y:y - 25
  }

  let handleClick = (e) => {
    console.log("equation clicked")
  }

  let equationCode = "";
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div on:click|stopPropagation={handleClick} class="equation fitContent"
  use:draggable={{
    bounds: 'parent',
    cancel: '.noDrag',
    defaultClass: 'draggable',
    defaultClassDragging: 'dragging',
    defaultClassDragged: 'dragged',
    position: initPosition
  }}

>
<MathField/>
</div>

<style>
.equation {
  position: absolute;
  padding: 0.8em;
  border: 2px solid grey;
  border-radius: 1em;
}
</style>