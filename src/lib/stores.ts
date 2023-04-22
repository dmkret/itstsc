import { writable } from 'svelte/store';

export const categories = writable<Category[]>([]);
export const costs = writable<Cost[]>([]);
