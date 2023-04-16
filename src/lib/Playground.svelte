<script>
import { onMount } from 'svelte'
import { supabase, user, isAuthed, canPlay } from '$pj/auth'
import settings from '$pj/settings'
import { logSessionLength } from '$pj/dataCollection'
import Equation from '$pc/Equation.svelte'
import Settings from '$pc/Settings.svelte'
import Trash from '$pc/Trash.svelte'
import AuthenticationRequired from '$pc/AuthenticationRequired.svelte'
import { playground } from '$pj/stores'

onMount(() => {
  // set value of playground store
  playground.set(pg)

  // log user session length
  window.addEventListener('beforeunload', async e => {
    if (!isAuthed()) return
    logSessionLength()
  })

  // auth listener
  const { data: authListener } = supabase.auth.onAuthStateChange(
    (event, session) => {
      $user = session?.user
    },
    { initial: true }
  )

  return () => {
    authListener.unsubscribe()
  }
})

let pg
const createEquation = e => {
  if (!canPlay()) {
    new AuthenticationRequired({ target: pg })
    return
  }
  new Equation({
    // credit to Johan Jaeger for the props syntax
    props: {
      x: e.offsetX,
      y: e.offsetY
    },
    target: pg
  })
}
</script>

<svelte:head>
  <script src="//unpkg.com/mathlive@0.89.4"></script>
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
  />
</svelte:head>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  bind:this={pg}
  on:click={createEquation}
  class="fillParent playground {$settings.theme}"
  style="font-size: {$settings.font}px;"
>
  <Settings />
  <Trash />
</div>

<style>
.playground {
  width: 100%;
  height: 100%;
  font-family: Roboto, Arial, sans-serif;

  position: relative;
  background-color: var(--background);
  color: var(--text);
  transition-duration: 1s;
  overflow: hidden;
}

.playground.light {
  --background: #ffffff;
  --text: #242424;
  --textFaded: #605f5f;
  --safe: #76bed0;
  --error: #f75b57;
  --warning: #ffdb44;
  box-shadow: inset 0px 0px 6px 1px grey;
}
.playground.dark {
  --background: black;
  --text: white;
  --safe: #136f63;
  --error: #d00000;
  --warning: #3f88c5;
}
</style>
