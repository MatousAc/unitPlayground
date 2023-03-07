<script>
	export let onClick
  export let outlined = false
</script>

<button
on:click={onClick}
class='{$$props.class}{(outlined) ? " outlined" : ""}'>
	<slot/>
</button>

<style>
button {
  border: none;
  cursor: pointer;
  background-color: transparent;
  color: inherit;
  font-size: inherit;
  padding: 0.2em 0.6em;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

button.outlined {
  border: 2px solid white;
  border-radius: 2em;
}
</style>