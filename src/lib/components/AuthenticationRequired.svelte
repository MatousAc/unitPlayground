<script>
import Modal from './Modal.svelte'
import Row from './Row.svelte'
import Button from './Button.svelte'
import { signIn } from '$pj/supabase'
import Col from './Col.svelte'

// bind modal to use its close()
let modal
</script>

<Modal bind:this={modal}>
  <h2 slot="header">
    <div>Please Sign In</div>
  </h2>

  <div slot="body">
    <Col justify="space-between">
      <div>
        UnitPlayground is in its experimental phase. In order to perform the
        experiment, users must authenticate with a southern.edu account.
      </div>
      <div>
        All Google accounts will be allowed in three weeks when the experiment
        is over.
      </div>
    </Col>
  </div>

  <Row slot="footer" justify="flex-end">
    <Button onClick={signIn} outlined={true}>
      <Row>
        <span class="material-symbols-rounded" style="margin-right:.3rem">
          login
        </span>
        <span style="padding-right: 5px;" class="hide-sm">Login</span>
      </Row>
    </Button>
  </Row>
</Modal>
