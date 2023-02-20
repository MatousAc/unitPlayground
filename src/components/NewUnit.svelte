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
  let attributes
  let sampleUnits = ''

  const setSampleUnits = () => {
    attributes = {
      aliases: names.splice(1),
      prefixes: prefixGroup,
      value: amount
    }
    console.log(nameStr)
    console.log(names)
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
      <Row>
        <span>Units you are producing: {sampleUnits}</span>
      </Row>
    </Fill>
  </div>

  <Button onClick={addUnit}/>
</Modal>