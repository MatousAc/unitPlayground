<script>
import { onMount } from 'svelte'
import Prefix from '$pj/Prefix'
import { addUnit } from '$pj/unitEngine'
import { unitMacros } from '$pj/stores'
import { getRandomSubarray, isMobile } from '$pj/helpers'
import { engine, parse } from '$pj/computeEngine'
import { converge } from '$pj/equation'
import * as E from '$pj/error'
import Modal from '$pc/Modal.svelte'
import Row from '$pc/Row.svelte'
import Button from '$pc/Button.svelte'
import Input from '$pc/Input.svelte'
import Select from '$pc/Select.svelte'
import Fill from '$pc/Fill.svelte'

// mathfield value
let amount
let isAmountValid = false
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
  // amount.value = '\\placeholder[value]{2.54\\cm}' // fixme when updating to MathLive 90.*.*
})

/// for processing new unit info ///
export let nameStr = ''
let { name = '', units = '' } = {}
let { prefixGroup, attributes = {}, longestUnit = 0 } = {}

const setSampleUnits = () => {
  let names = nameStr.trim().split(' ')
  let amt
  try {
    amt = converge(parse(amount.value).json).toString()
    amount.style.backgroundColor = 'transparent'
    isAmountValid = true
  } catch (e) {
    switch (e.constructor) {
      case E.DimensionMismatch:
      case E.UnrecognizedUnit:
      case E.MissingOperand:
      case E.Fail:
        console.error(e.message)
        amount.style.backgroundColor = '#ffd5d5'
        isAmountValid = false
        return
    }
  }
  attributes = {
    aliases: names.slice(1),
    prefixes: prefixGroup,
    value: amt,
    formatPrefixes: Prefix.getFormatPrefixes(prefixGroup)
    // autoAddToUnitSystem: 'auto'
  }
  name = names[0]
  units = attributes.formatPrefixes.flatMap(p => names.map(n => `${p}${n}`))

  units = getRandomSubarray(units, 6)
  longestUnit = units.reduce((maxLen, cur) => {
    return cur.length > maxLen ? cur.length : maxLen
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
        <div class="amountWrapper">
          <!-- fixme, use fill-in-the-blanks after update -->
          <div class="amount-placeholder" data-id="amount-placeholder">
            2.54\cm
          </div>
          <math-field
            bind:this={amount}
            on:input={setSampleUnits}
            on:focus={() => {
              const placeholder = document.querySelector(
                '[data-id="amount-placeholder"]'
              )
              if (placeholder) placeholder.remove()
            }}
            style={amount?.value === '' ? '' : 'background: white;'}
            virtual-keyboard-mode={isMobile() ? 'auto' : 'off'}
          />
        </div>
      </Row>
    </Fill>
    <Fill>
      <Select
        style="font-size: 0.8em;"
        bind:val={prefixGroup}
        name="prefixGroup"
        label="Prefixes"
        pill={false}
        on:change={setSampleUnits}
        options={Object.keys(Prefix.dictionary).map(prefix => ({
          name: Prefix.humanize(prefix),
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
        {#each units as unit, i}
          <span>{unit}</span>
        {/each}
      </div>
    </Fill>
  </div>

  <Row slot="footer" justify="flex-end">
    <Button
      onClick={async () => {
        if (isAmountValid && (await addUnit(name, attributes))) modal.close()
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

.amountWrapper {
  position: relative;
  min-width: 50%;
  min-height: 48px;
}

math-field {
  padding: 0.5rem 1rem;
  border: 2px solid black;
  background: transparent;
  border-radius: 0.5rem;
  min-width: 60%;
  font-size: large;
  width: 100%;
  height: 100%;
}

math-field:focus {
  background: white;
}

.amount-placeholder {
  position: absolute;
  color: #9ca3af;
  top: 20%;
  left: 10%;
  font-size: large;
}
</style>
