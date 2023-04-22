import type { Action } from 'svelte/action';

export const clickOutside: Action<HTMLElement, CallableFunction> = (node, callback) => {
	function handler(event: MouseEvent) {
		if (!callback) return;
		if (event.target instanceof HTMLElement && node.contains(event.target)) return;
		callback();
	}

	window.addEventListener('click', handler);

	return {
		destroy() {
			window.removeEventListener('click', handler);
		},
		update(new_callback) {
			callback = new_callback;
		},
	};
};
