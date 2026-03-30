/**
 * ARC (Adaptive Replacement Cache) implementation
 * Dynamically adapts to access patterns to maximize hit rates
 */
export class ARC {
	#size;
	#p;

	/**
	 * @param {number} [size=50] - Maximum cache size
	 */
	constructor(size = 50) {
		this.#size = size;
		this.#p = 0;
		this.cache = new Map();
		this.t1 = new Map();
		this.t2 = new Map();
		this.b1 = new Map();
		this.b2 = new Map();
	}

	/**
	 * Get value by key
	 * @param {string|number} key - The key to retrieve
	 * @returns {any|undefined} - The cached value or undefined
	 */
	get(key) {
		if (!this.cache.has(key)) {
			return undefined;
		}

		if (this.t1.has(key)) {
			this.t1.delete(key);
			this.t2.set(key, true);
		} else if (this.t2.has(key)) {
			this.t2.delete(key);
			this.t2.set(key, true);
		}

		return this.cache.get(key);
	}

	/**
	 * Set value by key
	 * @param {string|number} key - The key to set
	 * @param {any} value - The value to cache
	 */
	set(key, value) {
		if (this.cache.has(key)) {
			this.cache.set(key, value);
			this.get(key);
			return;
		}

		if (this.b1.has(key)) {
			this.#p = Math.min(
				this.#size,
				this.#p + Math.floor(this.b2.size / Math.max(1, this.b1.size)),
			);
			const delKey = this.t2.keys().next().value;
			if (delKey !== undefined) {
				this.t2.delete(delKey);
				this.b2.set(delKey, true);
			}
			this.t1.set(key, true);
			this.cache.set(key, value);
			return;
		}

		if (this.b2.has(key)) {
			this.#p = Math.max(0, this.#p - Math.floor(this.b1.size / Math.max(1, this.b2.size)));
			const delKey = this.t1.keys().next().value;
			if (delKey !== undefined) {
				this.t1.delete(delKey);
				this.b1.set(delKey, true);
			}
			this.t2.set(key, true);
			this.cache.set(key, value);
			return;
		}

		while (this.cache.size >= this.#size) {
			let delKey;
			let evicted;
			if (
				this.t1.size > 0 &&
				(this.#p >= this.#size || (this.#p < this.#size && this.b1.size < this.b2.size))
			) {
				delKey = this.t2.keys().next().value;
				if (delKey !== undefined) {
					this.t2.delete(delKey);
					this.b2.set(delKey, true);
					evicted = delKey;
				}
			} else {
				delKey = this.t1.keys().next().value;
				if (delKey !== undefined) {
					this.t1.delete(delKey);
					this.b1.set(delKey, true);
					evicted = delKey;
				}
			}
			if (evicted !== undefined && this.cache.has(evicted)) {
				this.cache.delete(evicted);
			}
		}

		this.cache.set(key, value);
		this.t1.set(key, true);
	}

	/**
	 * Delete key from cache
	 * @param {string|number} key - The key to delete
	 */
	delete(key) {
		if (this.cache.has(key)) {
			this.cache.delete(key);
			this.t1.delete(key);
			this.t2.delete(key);
			this.b1.delete(key);
			this.b2.delete(key);
		}
	}

	/**
	 * Check if key exists in cache
	 * @param {string|number} key - The key to check
	 * @returns {boolean} - True if key exists
	 */
	has(key) {
		return this.cache.has(key);
	}

	/**
	 * Remove all entries from cache
	 */
	clear() {
		this.cache.clear();
		this.t1.clear();
		this.t2.clear();
		this.b1.clear();
		this.b2.clear();
	}

	/**
	 * Get current cache size
	 * @returns {number} - Number of entries in cache
	 */
	get size() {
		return this.cache.size;
	}

	/**
	 * Get maximum cache size
	 * @returns {number} - Maximum size
	 */
	get maxSize() {
		return this.#size;
	}

	/**
	 * Get current p boundary
	 * @returns {number} - Current p value
	 */
	get p() {
		return this.#p;
	}

	/**
	 * Iterator over cache keys
	 * @returns {Iterator} - Key iterator
	 */
	*keys() {
		yield* this.cache.keys();
	}

	/**
	 * Iterator over cache values
	 * @returns {Iterator} - Value iterator
	 */
	*values() {
		yield* this.cache.values();
	}

	/**
	 * Iterator over [key, value] pairs
	 * @returns {Iterator} - Entry iterator
	 */
	*entries() {
		yield* this.cache.entries();
	}

	/**
	 * Iterate over all entries
	 * @param {Function} callback - Function to call for each entry
	 */
	forEach(callback) {
		this.cache.forEach((value, key) => callback(value, key, this));
	}

	/**
	 * JSON serialization
	 * @returns {Object} - Serializable representation
	 */
	toJSON() {
		return {
			size: this.size,
			entries: [...this.entries()],
		};
	}
}

/**
 * Factory function to create an ARC cache instance
 * @param {Object} [options={}] - Configuration options
 * @param {number} [options.size=50] - Maximum cache size
 * @returns {ARC} - New ARC cache instance
 */
export function arc(options = {}) {
	return new ARC(options.size || 50);
}
