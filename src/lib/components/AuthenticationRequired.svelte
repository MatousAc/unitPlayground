<script>
import { signIn } from 'pj/auth'
import Modal from 'pc/Modal.svelte'
import Row from 'pc/Row.svelte'
import Button from 'pc/Button.svelte'
import Col from 'pc/Col.svelte'
</script>

<Modal>
  <h2 slot="header">
    <div>Please Sign In</div>
  </h2>

  <div slot="body">
    <Col justify="space-between">
      <div>
        Please authenticate with a Google account so that your settings can be
        stored.
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
