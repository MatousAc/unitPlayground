<script>
  import { unitMacros } from '../js/stores'
  import { isMobile } from '../js/helpers'
  import { onMount, getContext } from 'svelte'
  import { eqKey } from '../js/equation'
  import { engine, parse } from '../js/computeEngine'

  const eq = getContext(eqKey)
  $: left = $eq.left
  $: right = $eq.right

  let input
  onMount(() => {
    // input.setOptions({
    //   enablePopover: false,
    //   macros: unitMacros,
    //   computeEngine: engine
    // })
    
    unitMacros.subscribe(val => {
      // input.setOptions({
      //   macros: val,
      //   computeEngine: engine
      // })
    })

    input.value = left
  })

  const feedback = () => {
    $eq = {
      left: input.value,
      right: right,
    }
  }

  const ejectTarget = e => {
    console.log("Ejecting target!")
  }

  let getOperandFromOffest = offset => {
    let latex = input.getValue()
    console.log("offset", offset)

    console.log(latex)

    let up2Latex = input.getValue(0, offset, 'latex')
    let up2AM = input.getValue(0, offset, 'ascii-math')
    console.log("up to offset: ", up2Latex, "|", up2AM)
    console.log("at offset: ", input.getValue(offset, offset+6 , 'latex'), "|", input.getValue(offset, offset+4, 'ascii-math'))
    console.log("latex pos:",up2Latex.length)
    const pmSplit = /[+\-]|(?:\\cdot)|(?:\\times)(?![^{]*})/g
    const fracMatch = /\\frac{((?:(?:\\frac{.*}{.*})+|[^{}]+)+)}{((?:(?:\\frac{.*}{.*})+|[^{}]+)+)}/g

    let area = input.getValue(offset, offset+6 , 'latex')
    area = area.replace(/(?:\\mathrm{)(.+)}/g, '\\$1')
    console.log("clicked on: ", area)

    let pmS = latex.split(pmSplit)
    console.log("pmSplit: ", pmS)
  }

  let numClicks = 0;
  let singleClickTimer
  const handleClick = e => {
    numClicks++;
    if (numClicks === 1) {
      singleClickTimer = setTimeout(() => {
        numClicks = 0;
        console.log(e)
      }, 300)
    } else if (numClicks > 1) {
      clearTimeout(singleClickTimer);
      numClicks = 0;
      // console.log("pos: ", input.position)
      
      let offset = input.offsetFromPoint(e.x-5, e.y)

      // console.log("math-json: ", input.getValue(offset, offset+4, 'math-json'))

      getOperandFromOffest(offset)
    }
  };

  const handleKeydown = e => {
		if (e.keyCode === 16) { // shift
      console.log(input.selection)
      let select = input.getValue(input.selection, 'latex-unstyled')
      console.log("selection: ", select)
      let rangeStart = input.selection.ranges[0][0]
      console.log("rangeStart ", rangeStart)
      let hbo = input.hitboxFromOffset(rangeStart)
      console.log("hitbox", hbo)
      console.log("last pos", input.lastOffset)
    } else if (e.keyCode === 91) { // win key
      var rect = input.getBoundingClientRect();
      console.log(rect.top, rect.right, rect.bottom, rect.left);
    }
	};
</script>

<!-- svelte-ignore a11y-autofocus -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<math-field
  bind:this={input}
  on:input={feedback}
  on:keydown={handleKeydown}
  on:click|preventDefault={handleClick}
  on:blur
  virtual-keyboard-mode={isMobile() ? 'auto' : 'off'}
  autofocus
/>

<style>
math-field {
  outline: none;
  display: flex;
  align-items: center;
}
</style>
