<script>
import Row from 'pc/Row.svelte'

export let name
export let label
export let ph
export let val
export let autofocus = false
</script>

<Row align="flex-end" justify="space-between">
  <label for={name}>
    {label}
  </label>
  <!-- svelte-ignore a11y-autofocus -->
  <input {name} bind:value={val} on:change placeholder={ph} {autofocus} />
</Row>

<style>
input {
  border-width: 1px;
  margin-left: 1em;
  padding: 0.5em;
  border-radius: 0.5rem;
  background-color: inherit;
  border: 2px solid currentColor;
  font-size: large;
}
</style>
