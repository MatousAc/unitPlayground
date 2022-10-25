<script>
  import { draggable } from "@neodrag/svelte"
  import Input from "./Input.svelte"
  import Result from "./Result.svelte"
  import Row from "./Row.svelte"

  let equation;
  export let x, y
  let initPosition = {
    x:x - 10, y:y - 25
  }

  let handleClick = (e) => {
    console.log("equation clicked")
  }

</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div 
bind:this={equation}
on:click|stopPropagation={handleClick}
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
    <Input/><Result/>
  </Row>
</div>

<style>
.equation {
  position: absolute;
  padding: 0 0.8em;
  border: 2px solid grey;
  border-radius: 1em;
}
</style>