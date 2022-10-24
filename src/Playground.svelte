<script>
  import Equation from './components/Equation.svelte'
  
  let createEquation = (e) => { 
    console.log("playground clicked")
    new Equation({
        // credit to Johan Jaeger
        props: {
          x:e.offsetX,
          y:e.offsetY
        },
        target: e.target
      }
    )
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div on:click={createEquation} class="playground fillParent">

</div>

<style>
  .playground {
    border: 2px dashed purple;
  }
</style>