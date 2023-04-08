<script>
import TextMedia from '$comp/TextMedia.svelte'
</script>

<TextMedia>
  <div slot="text">
    <h1 class="text-4xl font-bold text-center" style="color: var(--h1);">
      UnitPlayground
    </h1>
    <p class="text-center font-semibold lg:!mx-0">let the units guide you</p>

    <div class="my-8 text-lg">
      <p class="!m-0">
        Learn to appreciate units of measurement and construct equations in an
        interactive way.
      </p>
      <button
        class="startBtn float-right my-5 text-white font-bold py-2 px-4 rounded"
        on:click={() => (window.location.href = '/playground')}
      >
        Start Here
      </button>
    </div>
  </div>
  <img slot="media" alt="" src="/generalUse.gif" />
</TextMedia>

<p>
  Unit playground is a tool that encourages a deeper understanding of units. The
  Unit Playground aims to aid problem solvers by providing instant unit
  feedback, hints, and rearrangeable equations.
</p>
<p>
  As shown above, users can enter quantities and units on the canvass. To take
  these equations taken apart, simply double-click on a section of your
  equation. To put them back together, simply place an equation fragment onto a
  placeholder or elsewhere within an equation.
</p>
<p>
  When you make a mistake, UnitPlayground tries to detect it and show you
  helpful hints.
</p>
<p>
  If you are a student, teacher, or otherwise interested individual, you can <a
    href="/playground"
  >
    use UnitPlayground here
  </a>
  at any time free of charge. If you are looking to include UnitPlayground on your
  own website, refer to
  <a href="/docs">the docs</a>
  .
</p>

<TextMedia reverse={true}>
  <p slot="text" class="!m-0">
    There are many different settings you can configure.
  </p>
  <img slot="media" alt="" src="/settings.gif" />
</TextMedia>

<p>
  You can choose which system you want the output in and how precise you want it
  to be. Another amazing feature is creating your own units. Simply click on +
  Add Unit in the settings, and create a new unit.
</p>

<p>Stay tuned for more updates to the UnitPlayground. Enjoy!</p>

<style>
p {
  margin: 1rem 1.25rem;
}
.startBtn {
  background-color: var(--nav);
  border: 2px solid var(--nav-border);
}
</style>
