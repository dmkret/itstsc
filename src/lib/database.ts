import { categories, costs } from './stores';

const DB_NAME = 'database';
const COSTS_STORE_NAME = 'costs';
const CATEGORIES_STORE_NAME = 'categories';
const DATE_INDEX = 'date_idx';

class Database {
	private static instance: Database;

	private db: IDBDatabase | null = null;

	private constructor() {
		//
	}

	static getInstance() {
		if (!Database.instance) {
			Database.instance = new Database();
		}

		return Database.instance;
	}

	async init() {
		if (this.db) return;

		await new Promise<IDBDatabase>((resolve, reject) => {
			const request = indexedDB.open(DB_NAME, 1);
			request.addEventListener('success', () => {
				this.db = request.result;
				resolve(this.db);
			});
			request.addEventListener('error', () => {
				alert(
					'База данных не может инициализироваться, перезагрузите страницу или обновите браузер пж',
				);
				reject();
			});
			request.addEventListener('blocked', () => {
				alert('IndexedDB не поддерживается, обновите браузер пж');
				reject();
			});
			request.addEventListener('upgradeneeded', (event) => {
				this.db = request.result;

				if (event.oldVersion < 1) {
					const storeObject = this.db.createObjectStore(COSTS_STORE_NAME, {
						keyPath: 'id',
						autoIncrement: true,
					});
					storeObject.createIndex(DATE_INDEX, 'createdAt');
				}
				if (event.oldVersion < 2) {
					const storeObject = this.db.createObjectStore(CATEGORIES_STORE_NAME, {
						keyPath: 'id',
						autoIncrement: true,
					});
					storeObject.createIndex(DATE_INDEX, 'createdAt');
				}

				resolve(this.db);
			});
		});
	}

	listCosts = async () => {
		if (!this.db) return [];

		const transaction = this.db.transaction(COSTS_STORE_NAME, 'readwrite');
		const store = transaction.objectStore(COSTS_STORE_NAME);
		const request = store.index(DATE_INDEX).openCursor(null, 'prev');

		const entries: Cost[] = [];

		return new Promise<typeof entries>((resolve, reject) => {
			request.addEventListener('success', () => {
				const cursor = request.result;
				if (cursor) {
					entries.push(cursor.value);
					cursor.continue();
				} else {
					costs.set(entries);
					resolve(entries);
				}
			});
			request.addEventListener('error', () => reject(request.error));
		});
	};

	listCategories = async () => {
		if (!this.db) return [];

		const transaction = this.db.transaction(CATEGORIES_STORE_NAME, 'readwrite');
		const store = transaction.objectStore(CATEGORIES_STORE_NAME);
		const request = store.index(DATE_INDEX).openCursor(null, 'prev');

		const entries: Category[] = [];

		return new Promise<typeof entries>((resolve, reject) => {
			request.addEventListener('success', () => {
				const cursor = request.result;
				if (cursor) {
					entries.push(cursor.value);
					cursor.continue();
				} else {
					categories.set(entries);
					resolve(entries);
				}
			});
			request.addEventListener('error', () => reject(request.error));
		});
	};

	addCost = async (cost: Omit<Cost, 'id'>) => {
		if (!this.db) return;

		const transaction = this.db.transaction(COSTS_STORE_NAME, 'readwrite');
		const storage = transaction.objectStore(COSTS_STORE_NAME);

		const request = storage.add(cost);

		return new Promise((resolve, reject) => {
			request.addEventListener('success', () => {
				const completeCose = {
					...cost,
					id: request.result as number,
				};

				costs.update(($costs) =>
					[completeCose, ...$costs].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
				);

				resolve(completeCose);
			});
			request.addEventListener('error', () => reject(request.error));
		});
	};

	addCategory = async (category: Omit<Category, 'id' | 'createdAt'>) => {
		if (!this.db) return;

		const transaction = this.db.transaction(CATEGORIES_STORE_NAME, 'readwrite');
		const storage = transaction.objectStore(CATEGORIES_STORE_NAME);

		const newCategory = {
			...category,
			createdAt: new Date(),
		};

		const request = storage.add(newCategory);

		return new Promise<Category>((resolve, reject) => {
			request.addEventListener('success', () => {
				const completeCategory = { ...newCategory, id: request.result as number };
				categories.update(($categories) => [completeCategory, ...$categories]);

				resolve(completeCategory);
			});
			request.addEventListener('error', () => reject(request.error));
		});
	};
}

export const db = Database.getInstance();
