<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { db } from '$lib/database';
	import Categories from '$lib/components/Categories.svelte';

	let now = new Date();
	let categories: Category[] = [];
	let date = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now
		.getDate()
		.toString()
		.padStart(2, '0')}`;
	let value: string | null = null;
	let title: string = '';

	async function handleAdd() {
		if (!date) return;
		if (!value) return;
		if (!title) return;
		if (categories.length === 0) return;

		const floatValue = parseFloat(value);
		if (Number.isNaN(floatValue)) return;

		if (Number.isNaN(Date.parse(date))) return;
		const parsedDate = new Date(date);

		await db.addCost({ createdAt: parsedDate, value: floatValue, title });
		goto(base || '/');
	}
</script>

<form>
	<input type="date" bind:value={date} />
	<Categories bind:selected={categories} />
	<input bind:value={title} placeholder="Название" />
	<input bind:value placeholder="Сумма" />
	<button on:click={handleAdd}>+</button>
</form>

<style lang="scss">
	form {
		align-self: flex-end;

		bottom: 0;
		width: 100%;
		max-width: var(--max-with);

		display: grid;
		row-gap: 16px;
	}
</style>
