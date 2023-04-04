<script>
import { signIn, user } from '$pj/auth'
import Modal from '$pc/Modal.svelte'
import Row from '$pc/Row.svelte'
import Button from '$pc/Button.svelte'

let name, email, src
user.subscribe(u => {
  let userData = u.identities[0].identity_data
  name = userData.full_name
  email = userData.email
  src = userData.avatar_url
})

// bind modal to use its close()
let modal
</script>

<Modal bind:this={modal}>
  <h2 slot="header">
    <div>Profile</div>
  </h2>

  <div slot="body">
    <Row justify="space-between" style="padding: 1rem;">
      <div>Name:</div>
      <div>{name}</div>
    </Row>
    <Row justify="space-between" style="padding: 1rem;">
      <div>Email:</div>
      <div style="padding-left: 1rem;">{email}</div>
    </Row>
  </div>

  <Row slot="footer" justify="flex-end">
    <Button
      outlined={true}
      onClick={() => {
        signIn()
        modal.close()
      }}
    >
      <span class="material-symbols-rounded">switch_account</span>
      <span style="margin-left: 5px;">Switch Account</span>
    </Button>
  </Row>
</Modal>
