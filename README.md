# UnitPlayground
This library provides canvass-like a Svelte component that encourages a deeper understanding of units. This "unit playground" aims to aid problem solvers by providing instant unit feedback, hints, and rearrangeable equations.

[![version](https://img.shields.io/npm/v/unitplayground)](https://www.npmjs.com/package/unitplayground)
[![build](https://app.travis-ci.com/MatousAc/unitPlayground.svg?branch=main)](https://app.travis-ci.com/github/MatousAc/unitPlayground)
[![issues](https://img.shields.io/github/issues/matousac/unitplayground)](https://github.com/MatousAc/unitPlayground/issues)
[![dependencies](https://img.shields.io/librariesio/release/npm/unitplayground)](https://www.npmjs.com/package/unitplayground?activeTab=dependencies)
<!-- [![license](https://img.shields.io/npm/l/svelte.svg)](LICENSE.md) -->


<!-- toc -->
[Installation & Usage](#installation--usage) | [About](#about) | [Acknowledgements](#acknowledgements) | [License](#license)
<!-- tocstop -->

## Installation & Usage
### Install
Currently, this package is only available in Svelte projects. Simply install with npm.
```
npm i unitplayground
```
### Add to your project
To use the component in your project import it and place it within some container `<div>`. UnitPlayground will fill its parent container. Example:

<h5 a><strong><code>+page.svelte</code></strong></h5>

```svelte
<script>
  import UnitPlayground from 'unitplayground'
</script>

<div class=base>
  <UnitPlayground/>
</div>

<style>
  .base {
    max-width: 100%;
    width: 90vw;
    height: 50vh;
  }
</style>
```

## About
What is this package able to deliver?
Stay tuned . . .

## Acknowledgements
Thanks to the authors and maintainers of my dependencies, especially [mathlive](https://www.npmjs.com/package/mathlive), [@cortex-js/compute-engine](https://www.npmjs.com/package/@cortex-js/compute-engine), and [unitmath](https://www.npmjs.com/package/unitmath).
Also, thanks to Robert Ordóñez for the emotional support while I was developing this project.

## License
UnitPlayground is released under the MIT license.
