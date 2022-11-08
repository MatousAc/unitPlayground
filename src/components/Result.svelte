<script>
  import engine from "../js/computeEngine"
  import { getContext } from 'svelte';
  import eqKey, { getResultUnits } from "../js/equation.js"
  
  const eq = getContext(eqKey)
  $: left = $eq.left;
  $: right = $eq.right;

  $: mathJSON = engine.parse($eq.left).json;
  
  // eq.subscribe(val => {
  //   console.log(left);
  //   console.log(mathJSON);
  // })
  $: resultUnits = getResultUnits(mathJSON);
</script>

<math-field>
	{resultUnits}
</math-field>

<style>
	math-field {
		outline: none;
	}
</style>