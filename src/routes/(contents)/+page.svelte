<script>
import TextMedia from '$comp/TextMedia.svelte'
</script>

<TextMedia>
  <div slot="text">
    <h1 class="text-4xl font-bold text-center" style="color: var(--h1);">
      UnitPlayground
    </h1>
    <p class="mt-4 text-center font-semibold">let the units guide you</p>

    <div class="my-8 text-lg">
      <p>
        Learn to appreciate units of measurement and how they construct
        equations in an interactive way.
      </p>
      <button
        class="float-right my-5 text-white font-bold py-2 px-4 rounded"
        style="background-color: var(--nav);"
      >
        Start Here
      </button>
    </div>
  </div>
  <img slot="media" alt="" src="/generalUse.gif" />
</TextMedia>

<p class="mx-5">
  This library provides a Svelte component that encourages a deeper
  understanding of units. The Unit Playground aims to aid problem solvers by
  providing instant unit feedback, hints, and rearrangeable equations.
</p>

<TextMedia reverse={true}>
  <p slot="text">Check out all the different settings you can configure.</p>
  <img slot="media" alt="" src="/settings.gif" />
</TextMedia>

<style>
* {
  color: var(--text);
}

h1 {
  letter-spacing: -0.025em;
}

p {
  font-size: 1.125rem;
  line-height: 1.625rem;
}
</style>
