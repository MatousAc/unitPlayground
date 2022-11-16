<script>
  import engine from '../js/computeEngine'
  import { unitMacros } from '../js/units'
  import { onMount, getContext } from 'svelte'
  import { eqKey, getResultUnits } from '../js/equation.js'

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

    eq.subscribe(() => {
      let json = engine.parse($eq.left, { canonical: true }).json
      console.log('left: ', $eq.left)
      console.log('jsonStr: ', JSON.stringify(json))
      output.value = getResultUnits(json, output.value)
    })
  })
</script>

<math-field bind:this={output} />

<style>
</style>
