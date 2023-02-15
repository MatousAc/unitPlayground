<script>
	export let onClick
</script>

<button
on:click={onClick}
class='{$$props.class}'>
	<slot/>
</button>

<style>
button {
  border: 2px solid white;
  border-radius: 2em;
  cursor: pointer;
  background-color: transparent;
  color: inherit;
  font-size: inherit;
  padding: 0.2em 0.6em;
}

button:focus,
button:focus-visible {
	outline: 4px auto -webkit-focus-ring-color;
}
</style>