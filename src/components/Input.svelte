<script>
  export let name
  export let ph
  export let val
</script>

<div class="m-1">
  <label for="{name}">
    Unit Names
  </label>
  <input
  bind:value={val}
  placeholder="{ph}"
  class='br-half p-half ml-half'>
</div>

<style>
input {
  border-width: 1px;
}
</style>