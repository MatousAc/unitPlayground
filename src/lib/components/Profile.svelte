<script>
import Modal from './Modal.svelte'
import Row from './Row.svelte'
import Button from './Button.svelte'
import { signIn, signOut, user } from '$pj/supabase'

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
    <div>
      Name: {name}
    </div>
    <div>
      Email: {email}
    </div>
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
