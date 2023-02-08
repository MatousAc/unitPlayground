<script>
  import { forEach } from "mathjs"
  import { each } from "svelte/internal"

  export let value
  export let name
  export let options = []
</script>

<label for={name} class=m-3px>
  System
</label>
<select
  name={name}
  bind:value={value}
  class="ml-half"
  >
  {#each options as {name, value}}
    <option value={value}>{name}</option>
  {/each}
</select>

<style>
  select {
    font-size: 0.8em;
    padding: 0.3em;
    border-radius: 1em;
  }
</style>