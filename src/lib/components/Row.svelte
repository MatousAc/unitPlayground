<script>
export let justify = 'center'
export let align = 'center'
</script>

<div
  class="row justify-{justify} align-{align} {$$props.class}"
  style={$$props.style}
>
  <slot />
</div>

<style>
.row {
  display: flex;
  flex-direction: row;
  width: auto;
}

.justify-center {
  justify-content: center;
}

.justify-space-between {
  justify-content: space-between;
}

.justify-space-around {
  justify-content: space-around;
}

.justify-flex-end {
  justify-content: flex-end;
}

.justify-flex-start {
  justify-content: flex-start;
}

.justify-left {
  justify-content: left;
}

.justify-right {
  justify-content: right;
}

.align-center {
  align-items: center;
}

.align-space-between {
  align-items: space-between;
}

.align-space-around {
  align-items: space-around;
}

.align-flex-end {
  align-items: flex-end;
}

.align-left {
  align-items: left;
}

.align-right {
  align-items: right;
}

/* responsive design */
@media only screen and (max-width: 767px) {
  .hide-sm {
    display: none;
  }
}
</style>
