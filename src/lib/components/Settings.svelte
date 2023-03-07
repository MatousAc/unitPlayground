<script>
  import settings from '../js/settings'
  import Row from './Row.svelte'
  import Switch from './Switch.svelte'
	import ThemeSwitcher from './ThemeSwitcher.svelte'
  import Select from './Select.svelte'
  import Button from './Button.svelte'
  import NewUnit from './NewUnit.svelte'

  let thisBind
  let isOpen = false
  let themes = ['light', 'navy']

  let showNewUnitModal = () => {
    new NewUnit({ target: thisBind.parentNode })
  }
</script>
  
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div bind:this={ thisBind } class=settingsWrapper>
  <span 
    class='material-symbols-rounded settingsIcon p-5px{(isOpen) ? ' open' : ''}'
    on:click|stopPropagation={() => isOpen = !isOpen}>
    settings
  </span>
  <div 
    class='settings mb-1{(isOpen) ? ' open' : ''}'
    on:click|stopPropagation={() => {}}>
    <Button 
      onClick={showNewUnitModal}
      outlined={true}>
      <Row>
        <span 
          class='material-symbols-rounded'>
          add
        </span>
        <span class='pr-5px hide-under-900'>Add Unit</span>
      </Row>
    </Button>
    <Row>
      <label class=m-3px
        for=decimalPlaces>
        Precision
      </label>
      <input class='m-3px br-1 pl-half' name=decimalPlaces
        style="max-width: 4ch;"
        bind:value={$settings.precision}
        type=number step=1
        min=0
        max=9
      />
    </Row>
    <Row>
      <span class=m-3px>
        Scalars
      </span>
      <Switch name=includeScalar bind:checked={$settings.includeScalar}/>
    </Row>
    <Row>
      <Select name=system label=System bind:val={$settings.system}
        options={[
          {name: 'SI', value: 'si'},
          {name: 'US', value: 'us'},
          {name: 'Cgs', value: 'cgs'}
        ]}/>
    </Row>
    <Row>
      <span class=m-3px>
        Base Units
      </span>
      <Switch name=convertToSI bind:checked={$settings.simplify}/>
    </Row>
    <ThemeSwitcher bind:theme={$settings.theme}/>
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
  overflow: hidden;
}

.settings.open {
  transform: translateY(0) !important;
}
.settings {
  position: relative;
  z-index: 1;
  top: 0;
  left: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
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
</style>