<script>
import { onMount, getContext } from 'svelte'
import { get } from 'svelte/store'
import { unitmath, unitMacros, parseDict } from '$pj/stores'
import { eqKey, getResultUnits } from '$pj/equation'
import { isMobile } from '$pj/helpers'
import { parse } from '$pj/computeEngine'
import * as E from '$pj/error'

let right
const { l, r, hintInfo } = getContext(eqKey)

onMount(() => {
  right.setOptions({
    enablePopover: false,
    macros: unitMacros
  })

  unitMacros.subscribe(val => {
    right.setOptions({
      macros: val
    })
  })

  // all the places we need to recalculate
  l.subscribe(async l => reCalculate())
  unitmath.subscribe(u => reCalculate())
  parseDict.subscribe(p => reCalculate())
})

const reCalculate = async () => {
  let json = parse(get(l)).json
  // console.log(`Left => JSON | ${get(l)} => ${JSON.stringify(json)}`)
  let newLatex
  try {
    newLatex = '=' + getResultUnits(json)
    right.value = newLatex
    r.set(newLatex)
    hintInfo.set({ message: '', data: {} })
  } catch (e) {
    switch (e.constructor) {
      case E.NonError:
        break
      case E.UnrecognizedUnit:
      case E.DimensionMismatch:
      case E.ValueMissingOnUnit:
      case E.MissingOperand:
      case E.Fail:
      case E.Err:
      case E.FillPH:
      case E.Warning:
      case E.Hint:
        hintInfo.set({ message: e.message, data: e.data })
        break
      default:
        console.log(e)
    }
  }
}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<math-field
  bind:this={right}
  read-only
  on:click={() => right.previousElementSibling.focus()}
  on:blur
  virtual-keyboard-mode={isMobile() ? 'auto' : 'off'}
/>

<style>
math-field {
  outline: none;
}
</style>
