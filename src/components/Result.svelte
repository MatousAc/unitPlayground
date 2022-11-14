<script>
  import engine from "../js/computeEngine"
  import { macros } from "../js/stores.js"
  import { onMount, getContext } from 'svelte';
  import { eqKey, getResultUnits, inProgress } from "../js/equation.js"
  
  let output;
  const eq = getContext(eqKey)

  onMount(() => {
		output.setOptions({
			macros: macros
		})
    console.log(output.getOptions());
	})

  eq.subscribe(() => {
    let json = engine.parse($eq.left).json
    console.log('left: ', $eq.left);
    console.log('json: ', json);
    if (!inProgress(JSON.stringify(json))) {
      output.value = getResultUnits(json);
    }
  })
</script>

<math-field
  bind:this={output}>
</math-field>

<style>
</style>