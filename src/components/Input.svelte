<script>
  import { isMobile, macros, makeUnitMacros } from "../js/helpers"
	import { onMount } from 'svelte';

	let input;

	onMount(() => {
		input.setOptions({
			// virtualKeyboardMode: (isMobile()) ? "auto": "off",
			macros: {...macros, ...makeUnitMacros()}
		})
		console.log(input.getOptions())
	})

	let feedback = () => {
		console.log(input.value);
		console.log(input.getValue('math-json'));
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
		/* padding: 0 0.5em;
		border-radius: 1em; */
		outline: none;
	}
</style>