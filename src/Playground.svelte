<script>
  import Draggable from './components/Draggable.svelte'
  import Equation from './components/Equation.svelte'

  let createEquation = () => {
    console.log("playground clicked")
  }
</script>

<div on:click={createEquation} class="playground fillParent">
  <Draggable>
    <Equation/>
  </Draggable>
</div>

<style>
  .playground {
    border: 2px dashed purple;
  }
</style>