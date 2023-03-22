<script>
  import Equation from './components/Equation.svelte'
  import Settings from './components/Settings.svelte'
  import Trash from './components/Trash.svelte'
  import settings from './js/settings'

  let playground
  let createEquation = e => {
    new Equation({
      // credit to Johan Jaeger for the props syntax
      props: {
        x: e.offsetX,
        y: e.offsetY,
      },
      target: playground,
    })
  }

  let theme
  settings.subscribe(s => {
    theme = s.theme
  })
</script>

<svelte:head>
  <script src="//unpkg.com/mathlive@0.89.4"></script>
  <link rel='stylesheet' href='https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200' />
</svelte:head>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  bind:this={playground}
  on:click={createEquation}
  class='fillParent playground {theme}'
>
  <Settings/>
  <Trash/>
</div>

<style>
.playground {
  width: 100%;
  height: 100%;
  font-family: Roboto, Arial, sans-serif;
  font-size: 16px;

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
