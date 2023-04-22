import { derived, writable } from 'svelte/store';

import { formatDate } from './util';

export const categories = writable<Category[]>([]);
export const costs = writable<Cost[]>([]);

export const filters = writable({
	categories: [] as number[],
	from: null as Date | null,
	to: null as Date | null,
});

export const filteredCosts = derived([costs, filters], ([$costs, $filters]) => {
	const from = $filters.from ? formatDate($filters.from) : '';
	const to = $filters.to ? formatDate($filters.to) : '';

	return $costs.filter((cost) => {
		const formattedDate = formatDate(cost.createdAt);

		if (from && from > formattedDate) {
			return false;
		}

		if (to && to < formattedDate) {
			return false;
		}

		return true;
	});
});
