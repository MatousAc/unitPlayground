<script>
import Row from './Row.svelte'

export let name
export let label
export let val
export let options = []
</script>

<Row justify="space-between">
  <label for={name} style="margin-right: 0.5rem;">
    {label}
  </label>
  <select {name} bind:value={val} on:change>
    {#each options as { name, value }}
      <option {value}>{name}</option>
    {/each}
  </select>
</Row>

<style>
select {
  font-size: 0.8em;
  padding: 0.3em;
  border-radius: 1em;
  background-color: inherit;
  border: 2px solid currentColor;
}
select > option {
  color: black;
}
</style>
