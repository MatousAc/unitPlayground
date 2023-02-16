<script>
  import Row from './Row.svelte';

  export let name
  export let label
  export let val
  export let options = []
  console.log(options)
</script>

<Row justify='space-between'>
  <label for={name}>
    {label}
  </label>
  <select
    name={name}
    bind:value={val}
    class='ml-half'
    >
    {#each options as {name, value}}
      <option {value}>{name}</option>
    {/each}
  </select>
</Row>

<style>
select {
  font-size: 0.8em;
  padding: 0.3em;
  border-radius: 1em;
}
</style>