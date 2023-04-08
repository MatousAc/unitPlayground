<script>
import { onMount } from 'svelte'
import Highlight from 'svelte-highlight'
import vs2015 from 'svelte-highlight/styles/vs2015'
import rainbow from 'svelte-highlight/styles/rainbow'
import { theme } from '$js/stores'

export let language = ''
export let code = ''
export let copy = true

let codeTheme = 'dark'
onMount(() => {
  theme.subscribe(t => {
    codeTheme = t
    if (codeTheme === 'system') {
      let skeleton = document.querySelector('.skeleton')
      codeTheme = getComputedStyle(skeleton).getPropertyValue('--theme')
    }
  })
})

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(code)
    console.log('Code copied to clipboard')
  } catch (err) {
    console.error('Failed to copy: ', err)
  }
}
</script>

<svelte:head>
  {@html codeTheme === 'light' ? rainbow : vs2015}
</svelte:head>

<div class="relative my-4">
  <button class="{copy ? '' : 'hidden'} {codeTheme}" on:click={copyToClipboard}>
    <span class="material-symbols-rounded">content_copy</span>
  </button>
  <Highlight {language} {code} />
</div>

<style>
button {
  position: absolute;
  top: 0.7rem;
  right: 0.7rem;
  padding: 0.5rem 0.4rem 0.2rem;
  border-radius: 0.3rem;
  cursor: pointer;
  transition-duration: 0.2s;
  border-style: solid;
  border-width: 2px;
}

button.light {
  color: var(--background);
  border-color: transparent;
}

button.dark {
  color: var(--text);
  border-color: var(--nav);
}

button:hover.light {
  border-color: var(--h1);
}

button:hover.dark {
  border-color: var(--text);
}
</style>
