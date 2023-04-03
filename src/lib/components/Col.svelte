<script>
export let justify = 'center'
export let align = 'center'
</script>

<div class="col justify-{justify} align-{align} {$$props.class}">
  <slot />
</div>

<style>
.col {
  display: flex;
  flex-direction: column;
  height: fit-content;
  justify-content: center;
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
</style>
