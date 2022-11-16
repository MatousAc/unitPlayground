<script>
  import Equation from './components/Equation.svelte'
  import settings from './js/settings'

  let playground;
  let createEquation = (e) => { 
    new Equation({
        // credit to Johan Jaeger below
        props: {
          x:e.offsetX,
          y:e.offsetY
        },
        target: playground
      }
    )
  }

  let theme;
  settings.subscribe(s => {
    theme = s.theme;
  })
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div 
bind:this={playground}
on:click={createEquation}
on:blur={()=>console.log("playground blur")}
class="fillParent playground {theme}">
<!-- create settings overhang -->
</div>

<style>
  .playground {
    /* border-radius: 2em; */
    background-color: var(--backClr);
    color: var(--textClr);
  }
  
  .playground.light {
    --backClr: #FFFFFF;
    --textClr: #242424;
    --correctClr: #76BED0;
    --errorClr: #F55D3E;
    --accent1Clr: #F7CB15;
    border: 1px dashed var(--correctClr);
  }
  .playground.navy {
    --backClr: #032B43;
    --textClr: #FFBA08;
    --correctClr: #136F63;
    --errorClr: #D00000;
    --accent1Clr: #3F88C5;
  }
</style>