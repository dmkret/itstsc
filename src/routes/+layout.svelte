<script lang="ts">
	import { db } from '$lib/database';

	import { onMount } from 'svelte';

	let initialized = false;

	onMount(() => {
		db.init()
			.then(() => Promise.all([db.listCosts(), db.listCategories()]))
			.then(() => {
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
		<slot />
	</main>
{:else}
	Запуск...
{/if}

<style global lang="scss">
	:root {
		--max-with: 800px;
	}

	main {
		width: 100%;
		margin: auto;
		max-width: var(--max-with);

		min-height: 100%;

		display: grid;
	}

	html,
	body {
		padding: 0;
		margin: 0;

		height: 100%;
	}

	* {
		box-sizing: border-box;
		position: relative;
		-webkit-tap-highlight-color: transparent;
		border-radius: 0;

		font-family: Arial, Helvetica, sans-serif;
	}

	button {
		cursor: pointer;
		outline: none;
	}

	input,
	button {
		height: 48px;
		border: 1px solid black;
	}

	input:focus-visible {
		outline: 1px solid blue;
	}

	a {
		display: contents;
	}
</style>
