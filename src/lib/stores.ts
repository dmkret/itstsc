import { derived, writable } from 'svelte/store';

export const categories = writable<Category[]>([]);
export const costs = writable<Cost[]>([]);

export const filters = writable({
	categories: [] as number[],
	from: null as Date | null,
	to: null as Date | null,
});

export const filteredCosts = derived([costs, filters], ([$costs, $filters]) => {
	return $costs.filter((cost) => {
		if ($filters.from && cost.createdAt < $filters.from) {
			return false;
		}
		if ($filters.to && cost.createdAt > $filters.to) {
			return false;
		}
	});
});
