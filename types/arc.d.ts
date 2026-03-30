export class ARC {
	/**
	 * Create a new ARC cache instance
	 * @param {number} [size=50] - Maximum cache size
	 */
	constructor(size?: number);

	/**
	 * Get value by key
	 * @param {string|number} key - The key to retrieve
	 * @returns {any|undefined} - The cached value or undefined
	 */
	get(key: string | number): any | undefined;

	/**
	 * Set value by key
	 * @param {string|number} key - The key to set
	 * @param {any} value - The value to cache
	 */
	set(key: string | number, value: any): void;

	/**
	 * Delete key from cache
	 * @param {string|number} key - The key to delete
	 * @returns {void}
	 */
	delete(key: string | number): void;

	/**
	 * Check if key exists in cache
	 * @param {string|number} key - The key to check
	 * @returns {boolean} - True if key exists
	 */
	has(key: string | number): boolean;

	/**
	 * Remove all entries from cache
	 */
	clear(): void;

	/**
	 * Get current cache size
	 * @returns {number} - Number of entries in cache
	 */
	readonly size: number;

	/**
	 * Get maximum cache size
	 * @returns {number} - Maximum size
	 */
	readonly maxSize: number;

	/**
	 * Get current p boundary
	 * @returns {number} - Current p value
	 */
	readonly p: number;

	/**
	 * Iterator over cache keys
	 * @returns {Iterator} - Key iterator
	 */
	keys(): Iterator<string | number>;

	/**
	 * Iterator over cache values
	 * @returns {Iterator} - Value iterator
	 */
	values(): Iterator<any>;

	/**
	 * Iterator over [key, value] pairs
	 * @returns {Iterator} - Entry iterator
	 */
	entries(): Iterator<[string | number, any]>;

	/**
	 * Iterate over all entries
	 * @param {Function} callback - Function to call for each entry
	 */
	forEach(callback: (value: any, key: string | number, cache: ARC) => void): void;

	/**
	 * JSON serialization
	 * @returns {Object} - Serializable representation
	 */
	toJSON(): { size: number; entries: Array<[string | number, any]> };
}

/**
 * Factory function to create an ARC cache instance
 * @param {Object} [options={}] - Configuration options
 * @param {number} [options.size=50] - Maximum cache size
 * @returns {ARC} - New ARC cache instance
 */
export function arc(options?: { size?: number }): ARC;
