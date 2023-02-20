<script>
  import { get } from 'svelte/store';
  import Modal from './Modal.svelte';
  import { addUnit, aliasPrefixCombos } from '../js/unitEngine';
  import Button from './Button.svelte'
  import Input from './Input.svelte'
  import Select from './Select.svelte'
  import Fill from './Fill.svelte'
  import { prefixDictionary } from '../js/stores';
  import { getRandomSubarray, humanize } from '../js/helpers'
  import Row from './Row.svelte'
  import { unit } from '../js/umSetup';

  let nameStr = ''
  let name = ''
  let amount
  let prefixGroup
  let attributes
  let sampleUnits = ''

  const setSampleUnits = () => {
    let names = nameStr.trim().split(' ')
    let u = unit(amount)
    attributes = {
      aliases: names.slice(1),
      prefixes: prefixGroup,
      value: unit(amount).simplify({ system: 'auto'}).toString()
    }
    name = names[0]
    let units = aliasPrefixCombos(name, attributes)
    sampleUnits = getRandomSubarray(units, 6)
  }
</script>

<Modal>
  <h2 slot=header>
    New Unit
  </h2>

  <div slot=body>
    <Fill>
      <Input bind:val={nameStr} name=name label='Unit Names'
      ph='inch inches in' onChange={setSampleUnits}/>
    </Fill>
    <Fill>
      <Input bind:val={amount} name=amount 
      label=Amount ph='2.54 cm' onChange={setSampleUnits}/>
    </Fill>
    <Fill>
      <Select bind:val={prefixGroup} name=prefixGroup label=Prefixes
        onChange={setSampleUnits}
        options={
          Object.keys(get(prefixDictionary)).map(prefix => ({
            name: humanize(prefix),
            value: prefix
          }))
        }/>
    </Fill>
    <Fill>
      <Row justify=flex-start align=flex-start>
        <span class=pr-1>Examples</span>
        <div class="grid examples">
          {#each sampleUnits as unit, i}
          <span style="grid-area: u{i};">{unit}</span>
          {/each}
        </div>
      </Row>
    </Fill>
  </div>

  <Row slot=footer justify=flex-end>
    <Button onClick={() => addUnit(name, attributes)}>
      <span 
        class=material-symbols-rounded>
        add
      </span>
      <span class=pr-5px>Create Unit</span>
    </Button>
  </Row>
</Modal>

<style>
  .grid.examples {
    display: grid;
    gap: 0.5em;
    grid-template-areas: 
      "u0 u1"
      "u2 u3"
      "u4 u5";
  }
</style>