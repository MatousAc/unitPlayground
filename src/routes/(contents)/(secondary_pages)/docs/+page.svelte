<script>
import Code from '$comp/Code.svelte'
import bash from 'svelte-highlight/languages/bash'
import javascript from 'svelte-highlight/languages/javascript'

const upCode = `<script>
import UnitPlayground from 'unitplayground'
<\/script>

<div class="base">
  <UnitPlayground/>
</div>

<style>
.base {
  max-width: 100%;
  width: 90vw;
  height: 50vh;
}
<\/style>`
</script>

<h1>UnitPlayground Docs</h1>
<p>
  This library provides canvass-like a Svelte component that encourages a deeper
  understanding of units. This "unit playground" aims to aid problem solvers by
  providing instant unit feedback, hints, and rearrangeable equations.
</p>
<p />
<div class="flex my-4">
  <a href="https://www.npmjs.com/package/unitplayground">
    <img src="https://img.shields.io/npm/v/unitplayground" alt="version" />
  </a>
  <a href="https://app.travis-ci.com/github/MatousAc/unitPlayground">
    <img
      src="https://app.travis-ci.com/MatousAc/unitPlayground.svg?branch=main"
      alt="build"
    />
  </a>
  <a href="https://github.com/MatousAc/unitplayground/issues">
    <img
      src="https://img.shields.io/github/issues/matousac/unitplayground"
      alt="issues"
    />
  </a>
  <a href="https://www.npmjs.com/package/unitplayground?activeTab=dependencies">
    <img
      src="https://img.shields.io/librariesio/release/npm/unitplayground"
      alt="dependencies"
    />
  </a>
</div>
<ul class="my-4">
  <li>
    <a href="#installation--usage">Installation & Usage</a>
  </li>
  <li><a href="#about">About</a></li>
  <li><a href="#acknowledgements">Acknowledgements</a></li>
  <li><a href="#license">License</a></li>
</ul>
<h2 id="installation--usage">Installation & Usage</h2>
<h3>Install</h3>
<p>
  Currently, this package is only available in Svelte projects. Simply install
  with npm.
</p>
<Code language={bash} code="npm i unitplayground" />
<h3>Add to your project</h3>
<p>
  To use the component in your project import it and place it within some
  container. UnitPlayground will fill its parent container. Example:
</p>
<h4>
  <code><pre>+page.svelte</pre></code>
</h4>

<Code language={javascript} code={upCode} />

<h2 class="mt-10" id="about">About</h2>
<p>What is this package able to deliver?</p>
<p>Stay tuned</p>
<h2>Acknowledgements</h2>
<p>
  Thanks to the authors and maintainers of my dependencies, especially <a
    href="https://www.npmjs.com/package/mathlive"
  >
    mathlive
  </a>
  ,
  <a href="https://www.npmjs.com/package/@cortex-js/compute-engine">
    @cortex-js/compute-engine
  </a>
  , and
  <a href="https://www.npmjs.com/package/unitmath">unitmath</a>
  .
</p>
<p>
  Also, thanks to my professor Robert Ordóñez for support while I was developing
  this project.
</p>

<h2>License</h2>
<p>UnitPlayground is released under the MIT license.</p>

<style>
div.flex > a {
  margin-right: 1rem;
}
</style>
