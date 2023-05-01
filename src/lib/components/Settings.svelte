<script>
import { get } from 'svelte/store'
import { signIn, signOut, user, getIDData } from '$/lib/js/auth'
import settings, { updateSettings } from '$pj/settings'
import { playground } from '$pj/stores'
import Row from '$pc/Row.svelte'
import Switch from '$pc/Switch.svelte'
import ThemeSwitcher from '$pc/ThemeSwitcher.svelte'
import Select from '$pc/Select.svelte'
import Button from '$pc/Button.svelte'
import NewUnit from '$pc/NewUnit.svelte'
import Profile from '$pc/Profile.svelte'

let profileImage, isAuthed
let visible = false
let scalar, decimals, simplify, system
settings.subscribe(s => ({ scalar, decimals, simplify, system } = s))
user.subscribe(async u => {
  if (!(isAuthed = u !== undefined)) return
  profileImage = false
  // fixme: how can I reliably get profile images?
  // below we attempt to get a user's profile image
  // let userData = getIDData()
  // profileImage = userData.avatar_url
  // fetch(profileImage, { mode: 'no-cors' })
  //   .then(response => {
  //     if (response.ok) {
  //       // make blob to reference
  //       const blob = response.blob()
  //       const objectUrl = URL.createObjectURL(blob)
  //       profileImage = objectUrl
  //     } else {
  //       profileImage = false
  //     }
  //   })
  //   .catch(e => {
  //     profileImage = false
  //   })
})

const showNewUnitModal = () => {
  new NewUnit({ target: get(playground) })
}
const seeProfile = () => {
  new Profile({ target: get(playground) })
}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="settingsWrapper">
  <span
    style="padding: 0.4rem;"
    class="material-symbols-rounded settingsIcon{visible ? ' visible' : ''}"
    on:click|stopPropagation={() => (visible = !visible)}
  >
    settings
  </span>
  <div class="settings{visible ? ' visible' : ''}" on:click|stopPropagation>
    <Row
      class="general"
      justify="start"
      align="center"
      style="margin-bottom: 1rem;"
    >
      <Row>
        <div class="font-selector">
          {#each [18, 22, 25, 29, 32] as font}
            <button
              style="font-size:{font}px; text-decoration:{$settings.font ===
              font
                ? 'underline'
                : 'none'};"
              on:click={() => updateSettings({ font })}
            >
              A
            </button>
          {/each}
        </div>
      </Row>
      <ThemeSwitcher />
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
          {#if profileImage}
            <img class="profileImage" alt="" src={profileImage} />
          {:else}
            <span class="material-symbols-rounded account_circle">
              account_circle
            </span>
          {/if}
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
        <Select
          name="system"
          label="Unit System"
          on:change={() => updateSettings({ system })}
          bind:val={system}
          options={[
            { name: 'auto', value: 'auto' },
            { name: 'SI', value: 'si' },
            { name: 'US', value: 'us' },
            { name: 'Cgs', value: 'cgs' }
          ]}
        />
      </Row>
      <Row>
        <label style="margin: 3px;" for="decimals">Decimals</label>
        <input
          name="decimals"
          class="decimals"
          on:change={() => updateSettings({ decimals })}
          bind:value={decimals}
          type="number"
          step="1"
          min="0"
          max="9"
        />
      </Row>
      <Row>
        <span style="margin: 3px;">Scalars</span>
        <Switch
          name="scalar"
          bind:checked={scalar}
          on:change={() => updateSettings({ scalar })}
        />
      </Row>
      <Row class="hide-sm">
        <span style="margin: 3px; white-space: nowrap;">Simplify</span>
        <Switch
          name="simplify"
          bind:checked={simplify}
          on:change={() => updateSettings({ simplify })}
        />
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
  transition-duration: 0.3s;
  font-size: xx-large;
}
.settingsIcon.visible {
  filter: invert(1);
  transform: rotate(-270deg);
  transition-timing-function: cubic-bezier(0.97, -0.04, 0.15, 0.91);
}
.settingsWrapper {
  position: absolute;
  width: 100%;
  font-size: 16px;
}

.settings.visible {
  transform: translateY(0) !important;
}
.settings {
  position: relative;
  z-index: 1;
  top: 0;
  left: 0;
  background-color: var(--text);
  box-shadow: 0px 5px 8px 0 grey;
  color: var(--background);
  padding: 1em 2.5em 1em 1em;
  transform: translateY(-105%);
  transition-duration: 0.3s;
  transition-timing-function: ease-out;
}

.settings:hover {
  outline: 1px black;
}

/* settings children */
:global(.settings > .general > *:not(:first-child)) {
  margin-left: 1.5rem;
}

:global(.settings > .general > :first-child) {
  margin-right: auto;
}

:global(.settings > .functional > *:not(:first-child)) {
  margin-left: 1rem;
}

.account_circle {
  font-size: 2.3rem;
}

/* specific input styling */
.font-selector {
  background-color: rgba(255, 255, 255, 0.345);
  padding: 0.1rem 0.4rem;
  border-radius: 0.7rem;
}
.font-selector > button {
  margin: 0 0.4rem;
}
.decimals {
  max-width: 4ch;
  margin: 3px;
  border-radius: 1em;
  padding-left: 0.8rem;
  outline: none;
  color: var(--settingsText);
}

.settings .profileImage {
  width: 33px;
  border-radius: 1em;
}

/* responsive design */
@media only screen and (max-width: 767px) {
  .hide-sm {
    display: none;
  }

  :global(.settings > .general > *:not(:first-child)),
  :global(.settings > .functional > *:not(:first-child)) {
    margin-left: 0.5rem;
  }

  .account_circle {
    font-size: 1.8rem;
  }

  .settings > div > * {
    padding: 0.2em 0 !important;
  }
}
</style>
