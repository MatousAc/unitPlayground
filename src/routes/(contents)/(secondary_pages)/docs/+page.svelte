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
<pre><code>npm i unitplayground</code></pre>
<h3>Add to your project</h3>
<p>
  To use the component in your project import it and place it within some
  container <code>&lt;div&gt;</code>
  . UnitPlayground will fill its parent container. Example:
</p>
<h4>
  <a href="#pagesvelte"><strong><code>+page.svelte</code></strong></a>
</h4>
<pre><code>
&lt;script&gt;
import UnitPlayground from 'unitplayground'
&lt;/script&gt;

&lt;div class="base"&gt;
  &lt;UnitPlayground/&gt;
&lt;/div&gt;

&lt;style&gt;
.base {'{'}
  max-width: 100%;
  width: 90vw;
  height: 50vh;
{'}'}
&lt;/style&gt;

</code></pre>
<h2 id="about">About</h2>
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
