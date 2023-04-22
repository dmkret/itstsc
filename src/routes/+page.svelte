<script lang="ts">
	import { filteredCosts } from '$lib/stores';
	import { base } from '$app/paths';
	import Filters from '$lib/components/Filters.svelte';
	import Chart from '$lib/components/Chart.svelte';

	$: total = $filteredCosts.reduce((acc, i) => acc + i.value, 0);
</script>

<section>
	<Filters />

	<div class="total">
		<span>Потрачено</span>
		<span>{total}</span>
	</div>

	<Chart />

	<div class="list">
		{#each $filteredCosts as item, index (item.id)}
			{@const prev = $filteredCosts[index - 1]}
			{@const dateString = item.createdAt.toLocaleDateString()}
			{@const prevDateString = prev?.createdAt.toLocaleDateString()}

			{#if prevDateString !== dateString}
				<div class="date">{dateString}</div>
				<div />
			{/if}

			<span> {item.title} </span>
			<span class="value"> {item.value} </span>
		{/each}
	</div>

	<a href="{base}/add">
		<button class="add">+</button>
	</a>
</section>

<style lang="scss">
	section {
		display: grid;
		row-gap: 16px;
		padding-bottom: 64px;

		height: 100%;
		align-content: flex-start;
	}

	.total,
	.list {
		padding: 0 8px;
	}

	.total {
		font-size: 24px;
		font-weight: 700;
		display: grid;
		grid-template-columns: 1fr auto;
	}

	.list {
		row-gap: 8px;
		display: grid;

		height: 100%;
		align-content: flex-start;

		grid-template-columns: 1fr auto;

		.value {
			text-align: right;
		}

		.date {
			font-weight: 700;
		}
	}

	.add {
		position: fixed;
		bottom: 0;
		height: 48px;
		width: 100%;
		max-width: var(--max-with);
	}
</style>
