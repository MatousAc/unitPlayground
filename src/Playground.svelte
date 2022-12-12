<script>
  import Equation from './components/Equation.svelte'
  import Settings from './components/Settings.svelte'
  import settings from './js/settings'

  let playground
  let createEquation = e => {
    new Equation({
      // credit to Johan Jaeger below
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

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  bind:this={playground}
  on:click={createEquation}
  on:blur={() => console.log('playground blur')}
  class="fillParent playground {theme}"
>
  <Settings />
</div>

<style>
  .playground {
    position: relative;
    background-color: var(--backClr);
    color: var(--textClr);
    transition-duration: 1s;
    transition-property: background, color;
  }

  .playground.light {
    --backClr: #ffffff;
    --textClr: #242424;
    --correctClr: #76bed0;
    --errorClr: #f55d3e;
    --accent1Clr: #f7cb15;
    border: 1px dashed var(--correctClr);
    box-shadow: inset 0px 0px 6px 1px grey;
  }
  .playground.navy {
    --backClr: #032b43;
    --textClr: #ffba08;
    --correctClr: #136f63;
    --errorClr: #d00000;
    --accent1Clr: #3f88c5;
  }
</style>
