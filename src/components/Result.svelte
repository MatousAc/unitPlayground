<script>
  import engine from '../js/computeEngine'
  import { unitMacros } from '../js/units'
  import { onMount, getContext } from 'svelte'
  import { eqKey, getResultUnits } from '../js/equation.js'
  import settings from '../js/settings'
  import { isMobile } from '../js/helpers'

  let output
  const eq = getContext(eqKey)

  onMount(() => {
    output.setOptions({
      macros: unitMacros,
      computeEngine: engine,
    })
    console.log(output.getOptions())

    unitMacros.subscribe(val => {
      output.setOptions({ macros: val })
    })

    eq.subscribe(() => reCalculate())
    settings.subscribe(() => reCalculate())
  })

  let reCalculate = () => {
    let json = engine.parse($eq.left, { canonical: false }).json
    console.log('left: ', $eq.left)
    console.log('jsonStr: ', JSON.stringify(json))
    output.value = getResultUnits(json, output.value)
  }
</script>

<math-field bind:this={output}
on:blur
virtual-keyboard-mode={isMobile() ? 'auto' : 'off'}
/>

<style>
</style>
