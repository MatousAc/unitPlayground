<script>
import { onMount } from 'svelte'
import { supabase, user, isAuthed, signOut } from '$pj/auth'
import settings from '$pj/settings'
import Equation from '$pc/Equation.svelte'
import Settings from '$pc/Settings.svelte'
import Trash from '$pc/Trash.svelte'
import AuthenticationRequired from '$pc/AuthenticationRequired.svelte'

onMount(async () => {
  const { data: authListener } = supabase.auth.onAuthStateChange(
    (event, session) => {
      $user = session?.user
      let email = $user?.email
      // for now, we only allow SAU emails
      if (email) {
        let match = email.match(/^\S+@southern\.edu$/)
        if (match === null) {
          signOut()
          alert(
            'Only @southern.edu emails are allowed during the experimental period. You have been logged out.'
          )
        }
      }
    },
    { initial: true }
  )

  return () => {
    authListener.unsubscribe()
  }
})

let playground
const createEquation = e => {
  if (!isAuthed()) {
    new AuthenticationRequired({ target: playground })
    return
  }
  new Equation({
    // credit to Johan Jaeger for the props syntax
    props: {
      x: e.offsetX,
      y: e.offsetY
    },
    target: playground
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
  bind:this={playground}
  on:click={createEquation}
  class="fillParent playground {$settings.theme}"
  style="font-size: {$settings.font}px;"
>
  <Settings />
  <Trash />
</div>

<!-- {#if !session}
  <h1>I am not logged in</h1>
{:else}
  <h1>Welcome {session.user.email}</h1>
  <p>I am logged in!</p>
{/if} -->
<style>
.playground {
  width: 100%;
  height: 100%;
  font-family: Roboto, Arial, sans-serif;

  position: relative;
  background-color: var(--backClr);
  color: var(--textClr);
  transition-duration: 1s;
  overflow: hidden;
}

.playground.light {
  --backClr: #ffffff;
  --textClr: #242424;
  --textClrFaded: #605f5f;
  --safeClr: #76bed0;
  --dangerClr: #f55d3e;
  --accent1Clr: #f7cb15;
  box-shadow: inset 0px 0px 6px 1px grey;
}
.playground.dark {
  --backClr: black;
  --textClr: white;
  --safeClr: #136f63;
  --dangerClr: #d00000;
  --accent1Clr: #3f88c5;
}
</style>
