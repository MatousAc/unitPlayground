<script>
  import { isMobile, macros } from "../js/helpers"
	import { onMount } from 'svelte';
  import { setContext } from 'svelte';
  
  export let inVal;
	let input;

	onMount(() => {
		input.setOptions({
			macros: macros
		})
    console.log(input.getOptions());
	})

	let feedback = () => {
    inVal = input.value;
		console.log(inVal);
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