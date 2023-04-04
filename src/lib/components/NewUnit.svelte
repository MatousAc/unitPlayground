<script>
import { get } from 'svelte/store'
import { addUnit, aliasPrefixCombos } from '$pj/unitEngine'
import { prefixDictionary } from '$pj/stores'
import { getRandomSubarray, humanize } from '$pj/helpers'
import Modal from '$pc/Modal.svelte'
import Row from '$pc/Row.svelte'
import Button from '$pc/Button.svelte'
import Input from '$pc/Input.svelte'
import Select from '$pc/Select.svelte'
import Fill from '$pc/Fill.svelte'

/// for processing new unit info ///
let nameStr = '',
  sampleUnits = '',
  name = ''
let amount,
  prefixGroup,
  attributes = {}

const setSampleUnits = () => {
  let names = nameStr.trim().split(' ')
  attributes = {
    aliases: names.slice(1),
    prefixes: prefixGroup,
    value: amount
  }
  name = names[0]
  let units = aliasPrefixCombos(name, attributes)
  sampleUnits = getRandomSubarray(units, 6)
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
        onChange={setSampleUnits}
      />
    </Fill>
    <Fill>
      <Input
        bind:val={amount}
        name="amount"
        label="Amount"
        ph="2.54 cm"
        onChange={setSampleUnits}
      />
    </Fill>
    <Fill>
      <Select
        bind:val={prefixGroup}
        name="prefixGroup"
        label="Prefixes"
        onChange={setSampleUnits}
        options={Object.keys(get(prefixDictionary)).map(prefix => ({
          name: humanize(prefix),
          value: prefix
        }))}
      />
    </Fill>
    <Fill>
      <Row justify="flex-start" align="flex-start">
        <span style="padding-right: 1em;">Examples</span>
        <div class="grid examples">
          {#each sampleUnits as unit, i}
            <span style="grid-area: u{i};">{unit}</span>
          {/each}
        </div>
      </Row>
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
  gap: 0.5em;
  grid-template-areas:
    'u0 u1'
    'u2 u3'
    'u4 u5';
}
</style>
