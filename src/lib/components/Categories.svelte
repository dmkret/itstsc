<script lang="ts">
	import { clickOutside } from '$lib/actions';
	import { db } from '$lib/database';
	import { categories } from '$lib/stores';

	export let selected: Category[] = [];
	let search = '';
	let isSelectOpen = false;

	$: filteredCategories = $categories
		.filter((category) => {
			if (!search) return true;

			return category.title.includes(search);
		})
		.sort((a, b) => {
			if (selected.includes(a)) return -1;
			if (selected.includes(b)) return 1;
			return 0;
		});

	function handleClose() {
		search = '';
		isSelectOpen = false;
	}

	function toggleOpen() {
		isSelectOpen = !isSelectOpen;
	}

	async function handleCategoryAdd() {
		if (!search) return;

		const added = await db.addCategory({ title: search });
		if (added) {
			selected = [...selected, added];
			search = '';
		}
	}

	function toggleCategory(category: Category) {
		if (selected.includes(category)) {
			selected = selected.filter((c) => c !== category);
		} else {
			selected = [...selected, category];
		}
	}
</script>

<div class="select" use:clickOutside={handleClose}>
	<button class="value" on:click={toggleOpen} class:empty={selected.length === 0}>
		{#if selected.length > 0}
			{selected.map((c) => c.title).join(', ')}
		{:else}
			Выберите категории
		{/if}
	</button>

	{#if isSelectOpen}
		<div class="dropdown">
			<div class="list">
				{#each filteredCategories as category (category)}
					<button
						class="dd-item"
						class:selected={selected.includes(category)}
						on:click={() => toggleCategory(category)}
					>
						{category.title}
					</button>
				{/each}
			</div>

			<div class="filter">
				<input bind:value={search} placeholder="Поиск" />
				<button>Поиск</button>
			</div>
			{#if filteredCategories.length === 0}
				<button class="create" on:click={handleCategoryAdd}>Создать</button>
			{/if}
		</div>
	{/if}
</div>

<style lang="scss">
	.select {
		position: relative;
		width: 100%;
		cursor: pointer;

		height: 48px;
	}

	input {
		width: 100%;
	}

	.value {
		height: 100%;
		border: 1px solid black;
		text-align: left;
		display: block;

		width: 100%;
		background: transparent;
	}
	.value.empty {
		color: gray;
	}

	.dropdown {
		position: absolute;
		z-index: 999;

		bottom: 100%;
		width: 100%;
		overflow: auto;

		border: 1px solid black;
		border-bottom: none;

		background: white;

		.list {
			max-height: 200px;
			overflow: auto;

			button {
				width: 100%;
				border: none;
				background: transparent;

				text-align: left;

				height: 24px;

				&.selected {
					color: white;
					background: lightblue;
				}

				@media (hover: hover) {
					&:hover {
						background: lightgray;
					}
					&.selected:hover {
						color: white;
						background: blue;
					}
				}
			}
		}

		.filter {
			display: grid;
			grid-template-columns: 1fr auto;

			input {
				border: none;
				border-top: 1px solid black;
			}

			input,
			button {
				height: 32px;
			}
		}

		.create {
			width: 100%;
			height: 32px;
		}
	}
</style>
