<script>
import { onMount, getContext } from 'svelte'
import { get } from 'svelte/store'
import { fly } from 'svelte/transition'
import { eqKey } from 'pj/equation'
import { playground } from 'pj/stores'
import NewUnit from 'pc/NewUnit.svelte'

export let x = 2.8
const { hintInfo } = getContext(eqKey)
let info = { message: '', data: {} }

let lastCalledTime = 0
let hintDelay = 1500
onMount(() => {
  hintInfo.subscribe(async h => {
    if (!h.message || info?.message) updateData(h)
    setTimeout(() => {
      if (Date.now() - lastCalledTime >= hintDelay) updateData(h)
    }, hintDelay)
  })
})

const updateData = h => {
  info = h
  switch (info.data.background) {
    case 'safe':
    case 'warning':
    case 'error':
      info.data.color = 'background'
      break
    default:
      info.data.color = 'text'
  }
}

function slide(node, { delay = 0, duration = 400, x = 0, y = 0 }) {
  return fly(node, { delay, duration, x, y, opacity: 0 })
}
</script>

{#if info.message}
  <div
    class="hint"
    transition:slide|global={{ x: 0, y: 50 }}
    style="background-color: var(--{info.data.background}); color:var(--{info
      .data.color});"
  >
    {@html info.message}
    {#if info.data?.button}
      <button
        on:click={() =>
          new NewUnit({
            props: {
              nameStr: info.data.unitName
            },
            target: get(playground)
          })}
        style="text-decoration: underline; position: relative; z-index: 1;"
      >
        Create new unit?
      </button>
    {/if}
  </div>
{/if}

<style>
.hint {
  /* position on top behind */
  font-size: 0.7em;
  transform: translateZ(-10px);
  position: absolute;
  height: max-content;
  bottom: 80%;
  width: 100%;
  /* style */
  padding: 0.5rem 0.8rem 12%;
  border-top-left-radius: 0.3rem;
  border-top-right-radius: 0.3rem;
  left: 0;
}
</style>
