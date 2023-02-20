<script>
  import { get } from 'svelte/store';
  import Modal from './Modal.svelte';
  import { addUnit, aliasPrefixCombos } from '../js/unitEngine';
  import Button from './Button.svelte'
  import Input from './Input.svelte'
  import Select from './Select.svelte'
  import Fill from './Fill.svelte'
  import { prefixDictionary } from '../js/stores';
  import { humanize } from '../js/helpers'
  import Row from './Row.svelte'

  let nameStr = ''
  $: names = nameStr.split(' ')
  let amount
  let prefixGroup
  $: attributes = {
    aliases: names.splice(1),
    prefixes: prefixGroup,
    value: amount
  }

  let sampleUnits = ''
  const setSampleUnits = () => {
    console.log(attributes)
    sampleUnits = aliasPrefixCombos(names.splice(0, 1)[0], attributes).join(' ')
  }
</script>

<Modal>
  <h2 slot='header'>
    New Unit
  </h2>

  <div>
    <Fill>
      <Input val={nameStr} name=name label='Unit Names'
      ph='inch inches in' on:change={setSampleUnits}/>
    </Fill>
    <Fill>
      <Input val={amount} name=amount 
      label=Amount ph='2.54 cm' on:change={setSampleUnits}/>
    </Fill>
    <Fill>
      <Select val={prefixGroup} name=prefixGroup label=Prefixes
        on:change={setSampleUnits}
        options={
          Object.keys(get(prefixDictionary)).map(prefix => ({
            name: humanize(prefix),
            value: prefix
          }))
        }/>
    </Fill>
    <Fill>
      <Row>
        <span>Units you are producing: {sampleUnits}</span>
      </Row>
    </Fill>
  </div>

  <Button onClick={addUnit}/>
</Modal>