// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare namespace App {
	// interface Error {}
	// interface Locals {}
	// interface PageData {}
	// interface Platform {}
}

type Cost = {
	id: number;
	title: string;
	value: number;
	createdAt: Date;
	categories: number[];
};

type Category = {
	id: number;
	title: string;
	createdAt: Date;
};
