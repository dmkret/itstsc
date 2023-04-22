<script lang="ts">
	import { filters } from '$lib/stores';
	import Categories from './Categories.svelte';

	let from: string;
	let to: string;

	function handleFromChange() {
		if (Number.isNaN(Date.parse(from))) return;
		const parsedDate = new Date(from);
		$filters.from = parsedDate;
	}

	function handleToChange() {
		if (Number.isNaN(Date.parse(to))) return;
		const parsedDate = new Date(to);
		$filters.to = parsedDate;
	}
</script>

<div class="filters">
	<input type="date" bind:value={from} on:input={handleFromChange} />
	<input type="date" bind:value={to} on:input={handleToChange} />
	<Categories direction="down" />
</div>

<style lang="scss">
	.filters {
		z-index: 1;

		position: sticky;
		top: 0;

		display: grid;
		grid-template-columns: 1fr 1fr;

		:global(.categories) {
			grid-column: 1/-1;
		}

		:global(input),
		:global(button) {
			height: 24px;
		}
	}
</style>
