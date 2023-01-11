<script>
  import settings from '../js/settings'
  import Row from './Row.svelte'
  import Col from './Col.svelte'
  import Switch from './Switch.svelte'
	import ThemeSwitcher from "./ThemeSwitcher.svelte"

  let isOpen = false
  let themes = ["light", "navy"]
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class=settingsWrapper>
  <span 
    class="material-symbols-outlined settingsIcon p-5px{(isOpen) ? ' open' : ''}"
    on:click|stopPropagation={() => isOpen = !isOpen}>
    settings
  </span>
  <div 
    class='settings mb-1{(isOpen) ? ' open' : ''}'
    on:click|stopPropagation={() => {}}>
    <Col>
      <label class=m-3px
        for=significantDigits>
        {$settings.significantDigits} decimal place{
        $settings.significantDigits == 1 ? '' : 's'}
      </label>
      <input class=m-3px
        name=significantDigits
        type=range
        bind:value={$settings.significantDigits}
        min=0
        max=10
      />
    </Col>
    <Row>
      <span class=m-3px>
        Include scalar values
      </span>
      <Switch name=includeScalar bind:checked={$settings.includeScalar}/>
    </Row>
    <Row>
      <span class=m-3px>
        Simplify Units
      </span>
      <Switch name=convertToSI bind:checked={$settings.convertToSI}/>
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
    font-size: 1.2em;
    transform: translateY(-105%);
    transition-duration: 0.2s;
    transition-timing-function: ease-out;
  }

  .settings:hover {
    outline: 1px black;
  }
</style>
