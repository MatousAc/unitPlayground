<script>
  import Modal from './Modal.svelte';
  import { addUnit } from '../js/unitEngine';
  import Button from './Button.svelte'
  import Input from './Input.svelte'
  import Select from './Select.svelte'
  import Fill from './Fill.svelte'
  import { prefixDictionary } from '../js/stores';
  import { get } from 'svelte/store';

  let name
  let amount
  let prefix
</script>

<Modal>
  <h2 slot='header'>
    New Unit
  </h2>

  <div>
    <Fill>
      <Input val={name} name=name label='Unit Names'
      ph='inch inches in'/>
    </Fill>
    <Fill>
      <Input val={amount} name=amount 
      label=Amount ph='2.54 cm'/>
    </Fill>
    <Fill>
      <Select val={prefix} name=prefixGroup label=Prefixes
        />
    </Fill>
  </div>

  <Button onClick={addUnit}/>
</Modal>