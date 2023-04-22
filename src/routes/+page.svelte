<script lang="ts">
	import { db } from '$lib/database';

	import { onMount } from 'svelte';

	let initialized = false;

	let list: any[] = [];

	let newValue: string | null = null;

	async function handleAdd() {
		if (newValue === null) return;

		const numberValue = parseFloat(newValue);
		if (Number.isNaN(numberValue)) return;

		const item = await db.add({ value: numberValue });
		newValue = null;
		list = [item, ...list];
	}

	onMount(() => {
		db.init()
			.then(db.list)
			.then((result) => {
				list = result;
				initialized = true;
			});
	});
</script>

<svelte:head>
	<title>Деняк.net</title>
	<meta name="description" content="Деняк.net" />
</svelte:head>

{#if initialized}
	<main>
		<form class="add" on:submit|preventDefault={handleAdd}>
			<input type="string" placeholder="Сумма расхода" bind:value={newValue} />
			<button>Добавить</button>
		</form>

		<div class="list">
			{#each list as item (item.id)}
				<div class="item">{JSON.stringify(item)}</div>
			{/each}
		</div>
	</main>
{/if}

<style lang="scss">
	main {
		display: grid;
		justify-items: stretch;

		width: 100%;
		margin: auto;
		max-width: 800px;

		row-gap: 16px;
	}

	.add {
		display: grid;
		column-gap: 8px;
		grid-template-columns: 1fr auto;
	}

	.list {
		row-gap: 8px;
		display: grid;
	}
</style>
