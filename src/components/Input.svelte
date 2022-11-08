<script>
  import { isMobile, macros } from "../js/helpers"
	import { onMount } from 'svelte';
  import { getContext } from 'svelte';
  import eqKey from "../js/equation.js"
  
  const eq = getContext(eqKey)
  $: left = $eq.left;
  $: right = $eq.right;

  let input;
  onMount(() => {
		input.setOptions({
			macros: macros
		})
    console.log(input.getOptions());
	})

	let feedback = () => {
    $eq = {
      left: input.value,
      right: right
    }
	}
  
</script>

<math-field 
bind:this={input}
on:blur={feedback} 
on:input={feedback}
virtual-keyboard-mode={(isMobile()) ? "auto": "off"}
autofocus>
</math-field>

<style>
	math-field {
		outline: none;
	}
</style>