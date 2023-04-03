<script>
import { signIn, signOut, user } from '$pj/supabase'
import settings from '$pj/settings'
import Row from '$pc/Row.svelte'
import Switch from '$pc/Switch.svelte'
import ThemeSwitcher from '$pc/ThemeSwitcher.svelte'
import Select from '$pc/Select.svelte'
import Button from '$pc/Button.svelte'
import NewUnit from '$pc/NewUnit.svelte'
import Profile from '$pc/Profile.svelte'

let dis, profileImage
let isOpen = false
let isAuthed = false

user.subscribe(u => {
  if ((isAuthed = u !== undefined)) {
    let userData = u.identities[0].identity_data
    profileImage = userData.avatar_url
  }
})

const showNewUnitModal = () => {
  new NewUnit({ target: dis.parentNode })
}
const seeProfile = async () => {
  new Profile({ target: dis.parentNode })
}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div bind:this={dis} class="settingsWrapper">
  <span
    style="padding: 5px;"
    class="material-symbols-rounded settingsIcon{isOpen ? ' open' : ''}"
    on:click|stopPropagation={() => (isOpen = !isOpen)}
  >
    settings
  </span>
  <div
    class="settings{isOpen ? ' open' : ''}"
    on:click|stopPropagation={() => {}}
  >
    <Row
      class="general"
      justify="start"
      align="center"
      style="margin-bottom: 1rem;"
    >
      <Row>
        <div class="font-selector">
          {#each [16, 18, 20, 22, 24] as size}
            <button
              style="font-size:{size}px; text-decoration:{$settings.fontSize ===
              size
                ? 'underline'
                : 'none'};"
              on:click={() => ($settings.fontSize = size)}
            >
              A
            </button>
          {/each}
        </div>
      </Row>
      <ThemeSwitcher bind:theme={$settings.theme} />
      {#if isAuthed}
        <Button onClick={signOut} outlined={true}>
          <Row>
            <span class="material-symbols-rounded" style="margin-right:.3rem">
              logout
            </span>
            <span style="padding-right: 5px;" class="hide-sm">Logout</span>
          </Row>
        </Button>
        <Button onClick={seeProfile} outlined={false}>
          <img class="profileImage" alt="" src={profileImage} />
        </Button>
      {:else}
        <Button onClick={signIn} outlined={true}>
          <Row>
            <span class="material-symbols-rounded" style="margin-right:.3rem">
              login
            </span>
            <span style="padding-right: 5px;" class="hide-sm">Login</span>
          </Row>
        </Button>
      {/if}
    </Row>
    <Row class="functional" justify="start" align="center">
      <Button onClick={showNewUnitModal} outlined={true}>
        <Row>
          <span class="material-symbols-rounded">add</span>
          <span style="padding-right: 5px;" class="hide-sm">Add Unit</span>
        </Row>
      </Button>
      <Row>
        <label style="margin: 3px;" for="precision">Precision</label>
        <input
          name="precision"
          class="precision"
          bind:value={$settings.precision}
          type="number"
          step="1"
          min="0"
          max="9"
        />
      </Row>
      <Row>
        <span style="margin: 3px;">Scalars</span>
        <Switch name="includeScalar" bind:checked={$settings.includeScalar} />
      </Row>
      <Row>
        <Select
          name="system"
          label="System"
          bind:val={$settings.system}
          options={[
            { name: 'SI', value: 'si' },
            { name: 'US', value: 'us' },
            { name: 'Cgs', value: 'cgs' }
          ]}
        />
      </Row>
      <Row>
        <span style="margin: 3px; white-space: nowrap;">Base Units</span>
        <Switch name="convertToSI" bind:checked={$settings.simplify} />
      </Row>
    </Row>
  </div>
</div>

<style>
.settingsIcon {
  position: absolute;
  top: 0;
  right: 0;
  cursor: pointer;
  z-index: 2;
  transition-duration: 0.4s;
}
.open.settingsIcon {
  filter: invert(1);
  transform: rotate(-270deg);
  transition-timing-function: cubic-bezier(0.97, -0.04, 0.15, 0.91);
}
.settingsWrapper {
  position: absolute;
  width: 100%;
  font-size: 16px;
}

.settings.open {
  transform: translateY(0) !important;
}
.settings {
  position: relative;
  z-index: 1;
  top: 0;
  left: 0;
  background-color: var(--textClr);
  box-shadow: 0px 5px 8px 0 grey;
  color: var(--backClr);
  padding: 1em 2em 1em 1em;
  transform: translateY(-105%);
  transition-duration: 0.2s;
  transition-timing-function: ease-out;
}

.settings:hover {
  outline: 1px black;
}

/* settings children */
:global(.settings > .general > *:not(:first-child)) {
  margin-left: 2rem;
}

:global(.settings > .general > :first-child) {
  margin-right: auto;
}

:global(.settings > .functional > *:not(:first-child)) {
  margin-left: 1rem;
}

/* responsive design */
@media only screen and (max-width: 767px) {
  .hide-sm {
    display: none;
  }
}

/* specific input styling */
.font-selector {
  background-color: rgba(255, 255, 255, 0.345);
  padding: 0.2rem 0.4rem;
  border-radius: 0.7rem;
}
.font-selector > button {
  margin: 0 0.4rem;
}
.precision {
  max-width: 4ch;
  margin: 3px;
  border-radius: 1em;
  padding-left: 0.8rem;
  outline: none;
}

.settings .profileImage {
  width: 33px;
  border-radius: 1em;
}
</style>
