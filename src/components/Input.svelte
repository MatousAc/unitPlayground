<script>
  import Row from './Row.svelte'

  export let onChange = () => {}
  export let name
  export let label
  export let ph
  export let val
</script>

<Row align='flex-end' justify='space-between'>
  <label for='{name}'>
    {label}
  </label>
  <input
  {name}
  bind:value={val}
  placeholder='{ph}'
  on:change={onChange}
  class='br-half p-half ml-1'>
</Row>

<style>
input {
  border-width: 1px;
}
</style>