<script lang="ts">
	import { onMount } from 'svelte';
	import { Chart, registerables } from 'chart.js';
	import { filteredCosts, categories } from '$lib/stores';

	let canvas: HTMLCanvasElement;
	let chart: Chart<'doughnut', number[], any> | null;

	$: categoriesMap = $filteredCosts.reduce((acc, item) => {
		for (const categoryId of item.categories) {
			const total = acc.get(categoryId);
			if (total !== undefined) {
				acc.set(categoryId, total + item.value);
			} else {
				acc.set(categoryId, item.value);
			}
		}

		return acc;
	}, new Map<number, number>());

	$: categoriesMap, updateChartData();

	function getChartData() {
		const labels: string[] = [];
		const values: number[] = [];

		for (const [k, v] of categoriesMap.entries()) {
			labels.push($categories.find((category) => category.id === k)?.title ?? '');
			values.push(v);
		}

		return { labels, values };
	}

	function updateChartData() {
		if (!chart) return;

		const { labels, values } = getChartData();

		chart.data.labels = labels;
		chart.data.datasets[0].data = values;
		chart.update();
	}

	onMount(() => {
		Chart.register(...registerables);

		const { labels, values } = getChartData();

		chart = new Chart(canvas, {
			type: 'doughnut',
			options: {
				maintainAspectRatio: false,
			},
			data: {
				labels,
				datasets: [
					{
						data: values,
						hoverOffset: 4,
					},
				],
			},
		});
	});
</script>

<div class="container">
	<canvas bind:this={canvas} />
</div>

<style>
	.container {
		width: 100%;
		height: 200px;
	}
</style>
