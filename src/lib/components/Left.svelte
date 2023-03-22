<script>
  import { unitMacros } from '../js/stores'
  import { isMobile } from '../js/helpers'
  import { onMount, getContext } from 'svelte'
  import { eqKey } from '../js/equation'
  import Combine from './Combine.svelte'

  const eq = getContext(eqKey)
  $: left = $eq.left
  $: right = $eq.right

  let input
  onMount(() => {
    // input.setOptions({
    //   enablePopover: false,
    //   macros: unitMacros
    // })
    
    // unitMacros.subscribe(val => {
    //   input.setOptions({ macros: val })
    // })

    input.value = left
  })

  const feedback = () => {
    $eq = {
      left: input.value,
      right: right
    }
  }
</script>

<Combine op={'+'}/>

<style>
</style>
