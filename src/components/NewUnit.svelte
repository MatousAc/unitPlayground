<script>
  import Modal from "./Modal.svelte";
  import { addUnit } from "../js/unitEngine";
  import Button from "./Button.svelte"
  import Input from "./Input.svelte"

  let name
  let amount
</script>

<Modal>
  <h2 slot="header">
    New Unit
  </h2>

  <div>
    <Input val={name} name="name" ph="Separate aliases w/ spaces"/>
    <Input val={amount} name="amount" ph="12 inches . . . "/>
  </div>

  <Button onClick={addUnit}/>
</Modal>