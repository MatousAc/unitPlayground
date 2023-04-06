<script>
import { onMount } from 'svelte'
import { get } from 'svelte/store'
import { addUnit, aliasPrefixCombos } from '$pj/unitEngine'
import { prefixDictionary, unitMacros } from '$pj/stores'
import { getRandomSubarray, humanize, isMobile } from '$pj/helpers'
import { engine, parse } from '$pj/computeEngine'
import { converge } from '$pj/equation'
import Modal from '$pc/Modal.svelte'
import Row from '$pc/Row.svelte'
import Button from '$pc/Button.svelte'
import Input from '$pc/Input.svelte'
import Select from '$pc/Select.svelte'
import Fill from '$pc/Fill.svelte'

// mathfield value
let amount
onMount(() => {
  amount.setOptions({
    enablePopover: false,
    macros: unitMacros,
    computeEngine: engine
  })

  unitMacros.subscribe(val => {
    amount.setOptions({
      macros: val,
      computeEngine: engine
    })
  })
})

/// for processing new unit info ///
let nameStr = '',
  sampleUnits = '',
  name = ''
let prefixGroup,
  attributes = {},
  longestUnit = 0

const setSampleUnits = () => {
  let names = nameStr.trim().split(' ')
  attributes = {
    aliases: names.slice(1),
    prefixes: prefixGroup,
    value: converge(parse(amount.value).json).toString()
  }
  name = names[0]
  let units = aliasPrefixCombos(name, attributes)
  sampleUnits = getRandomSubarray(units, 6)
  longestUnit = sampleUnits.reduce((maxLength, currentString) => {
    return currentString.length > maxLength ? currentString.length : maxLength
  }, 0)
}

// bind modal to use its close()
let modal
</script>

<Modal bind:this={modal}>
  <h2 slot="header">New Unit</h2>

  <div slot="body">
    <Fill>
      <Input
        autofocus={true}
        bind:val={nameStr}
        name="name"
        label="Unit Names"
        ph="inch inches in"
        on:change={setSampleUnits}
      />
    </Fill>
    <Fill>
      <Row justify="space-between">
        <span>Definition</span>
        <math-field
          bind:this={amount}
          placeholder="2.54 cm"
          on:change={setSampleUnits}
          virtual-keyboard-mode={isMobile() ? 'auto' : 'off'}
        />
      </Row>
    </Fill>
    <Fill>
      <Select
        bind:val={prefixGroup}
        name="prefixGroup"
        label="Prefixes"
        on:change={setSampleUnits}
        options={Object.keys(get(prefixDictionary)).map(prefix => ({
          name: humanize(prefix),
          value: prefix
        }))}
      />
    </Fill>
    <Fill>
      <span>Examples of the units you are creating:</span>
      <div
        class="grid examples"
        style="grid-template-columns: repeat(auto-fit, minmax({longestUnit}ch, max-content));"
      >
        {#each sampleUnits as unit, i}
          <span>{unit}</span>
        {/each}
      </div>
    </Fill>
  </div>

  <Row slot="footer" justify="flex-end">
    <Button
      onClick={() => {
        addUnit(name, attributes)
        modal.close()
      }}
    >
      <span class="material-symbols-rounded">add</span>
      <span style="padding-left 5px;">Create Unit</span>
    </Button>
  </Row>
</Modal>

<style>
.grid.examples {
  display: grid;
  grid-auto-rows: min-content;
  grid-gap: 1em;
}

.grid.examples > span {
  border: 2px solid currentColor;
  border-radius: 1rem;
  padding: 0.2rem 0.5rem;
  max-width: fit-content;
  min-width: fit-content;
}

math-field {
  padding: 0.5rem 1rem;
  border: 2px solid black;
  border-radius: 1rem;
  min-width: 60%;
  font-size: large;
}
</style>
