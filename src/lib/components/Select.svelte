<script>
import Row from '$pc/Row.svelte'

export let name
export let label
export let val
export let options = []
export let pill = true
</script>

<Row justify="space-between">
  <label class="hide-sm" for={name} style="margin-right: 0.5rem;">
    {label}
  </label>
  <select
    {name}
    bind:value={val}
    on:change
    style="{pill ? 'border-radius: 1em;' : ''}{$$props.style}"
  >
    {#each options as { name, value }}
      <option {value}>{name}</option>
    {/each}
  </select>
</Row>

<style>
select {
  padding: 0.3em;
  border-radius: 0.5rem;
  background-color: inherit;
  border: 2px solid currentColor;
}

select > option {
  color: black;
}

/* responsive design */
@media only screen and (max-width: 767px) {
  .hide-sm {
    display: none;
  }
}
</style>
