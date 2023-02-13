<script>
  import engine from '../js/computeEngine'
  import { unitMacros } from '../js/unitOcean'
  import { onMount, getContext } from 'svelte'
  import { eqKey, getResultUnits } from '../js/unitmath.js'
  import settings from '../js/settings'
  import { isMobile } from '../js/helpers'

  let result
  const eq = getContext(eqKey)

  onMount(() => {
    result.setOptions({
      macros: unitMacros,
      computeEngine: engine,
    })
    console.log(result.getOptions())

    unitMacros.subscribe(val => {
      result.setOptions({ macros: val })
    })

    eq.subscribe(() => reCalculate())
    settings.subscribe(() => reCalculate())
  })

  let reCalculate = () => {
    let json = engine.parse($eq.left, { canonical: false }).json
    console.log('left: ', $eq.left)
    console.log('jsonStr: ', JSON.stringify(json))
    result.value = getResultUnits(json, result.value)
  }
</script>

<math-field bind:this={result}
  virtual-keyboard-mode={isMobile() ? 'auto' : 'off'}
/>

<style>
</style>
