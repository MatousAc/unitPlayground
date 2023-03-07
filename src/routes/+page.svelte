<script>
	import { onMount } from 'svelte'
  import { UnitPlayground } from '../lib/index'

  let up
  onMount(() => {
    new UnitPlayground({
      target: up
    })
  })
</script>

<h1>Welcome to your library project</h1>
<p>Create your package using @sveltejs/package and preview/showcase your work with SvelteKit</p>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
<div bind:this={up} class=unitPlayground></div>

<style>
.unitPlayground {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 50%;
  font-family: Roboto, Arial, sans-serif;
}
</style>