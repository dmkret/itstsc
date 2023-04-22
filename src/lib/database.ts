import { costs } from './stores';

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
			const request = indexedDB.open('costs', 1);
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

				switch (event.oldVersion) {
					case 0: {
						const storeObject = this.db.createObjectStore('costs', {
							keyPath: 'id',
							autoIncrement: true,
						});
						storeObject.createIndex(DATE_INDEX, 'createdAt');
					}
				}

				resolve(this.db);
			});
		});
	}

	list = async () => {
		if (!this.db) return [];

		const transaction = this.db.transaction('costs', 'readwrite');
		const costs = transaction.objectStore('costs');

		const request = costs.index(DATE_INDEX).openCursor(null, 'prev');

		const entries: any[] = [];

		return new Promise<any[]>((resolve, reject) => {
			request.addEventListener('success', () => {
				const cursor = request.result;
				if (cursor) {
					entries.push(cursor.value);
					cursor.continue();
				} else {
					resolve(entries);
				}
			});
			request.addEventListener('error', () => reject(request.error));
		});
	};

	add = async (cost: any) => {
		if (!this.db) return;

		const transaction = this.db.transaction('costs', 'readwrite');
		const costsStore = transaction.objectStore('costs');

		delete cost.id;
		cost.createdAt = new Date();
		const request = costsStore.add(cost);

		return new Promise((resolve, reject) => {
			request.addEventListener('success', () => {
				cost.id = request.result;
				costs.update(($costs) => [cost, ...$costs]);

				resolve(cost);
			});
			request.addEventListener('error', () => reject(request.error));
		});
	};
}

export const db = Database.getInstance();
