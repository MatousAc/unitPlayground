<script>
  export let justify='center'
  export let align='center'
</script>

<div class='row justify-content-{justify} align-items-{align} {$$props.class}'>
	<slot></slot>
</div>

<style>
.row {
	display: flex;
	flex-direction: row;
	width: auto;
}
</style>