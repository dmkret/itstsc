<script lang="ts">
	import { costs } from '$lib/stores';
	import { base } from '$app/paths';

	$: total = $costs.reduce((acc, i) => acc + i.value, 0);
</script>

<section>
	<div class="total">
		<span>Всего</span>
		<span>{total}</span>
	</div>

	<div class="list">
		{#each $costs as item, index (item.id)}
			{@const prev = $costs[index - 1]}
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
