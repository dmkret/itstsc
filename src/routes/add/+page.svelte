<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { db } from '$lib/database';
	import Categories from '$lib/components/Categories.svelte';
	import { formatDate } from '$lib/util';

	let now = new Date();
	let categories: Category[] = [];
	let date = formatDate(now);
	let value: string | null = null;
	let title: string = '';

	async function handleAdd() {
		if (!date) date = formatDate(now);
		if (!value) {
			alert('Заполните сумму расхода');
			return;
		}
		if (!title) {
			alert('Заполните название');
			return;
		}
		if (categories.length === 0) {
			alert('Выберите хотя бы одну категорию');
			return;
		}

		const floatValue = parseFloat(value);
		if (Number.isNaN(floatValue)) return;

		if (Number.isNaN(Date.parse(date))) return;
		const parsedDate = new Date(date);

		await db.addCost({
			createdAt: parsedDate,
			value: floatValue,
			title,
			categories: categories.map((c) => c.id),
		});

		goto(base || '/');
	}
</script>

<a href={base || '/'}>
	<button>Назад</button>
</a>

<form on:submit|preventDefault={handleAdd}>
	<input type="date" bind:value={date} />
	<Categories bind:selected={categories} withCreation />
	<input bind:value={title} placeholder="Название" />
	<input bind:value placeholder="Сумма" />
	<button>Добавить</button>
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
