<script>
  import Row from './Row.svelte'

  export let name
  export let label
  export let ph
  export let val
  export let autofocus = false
</script>

<Row align='flex-end' justify='space-between'>
  <label for='{name}'>
    {label}
  </label>
  <!-- svelte-ignore a11y-autofocus -->
  <input
  {name}
  bind:value={val}
  placeholder='{ph}'
  autofocus={autofocus}>
</Row>

<style>
input {
  border-width: 1px;
  margin-left: 1em;
  padding: .5em;
  border-radius: 0.5em;
}
</style>