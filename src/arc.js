/**
 * ARC (Adaptive Replacement Cache) implementation
 * Dynamically adapts to access patterns to maximize hit rates
 */
export class ARC {
  #size;

  /**
   * @param {number} size - Maximum cache size
   */
  constructor(size) {
    this.#size = size;
    this.cache = new Map();
    this.p1 = new Map();
    this.p2 = new Map();
    this.t1 = new Map();
    this.t2 = new Map();
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

    if (this.p1.has(key)) {
      this.p1.delete(key);
      this.p2.set(key, true);
      this.adjust();
    } else if (this.p2.has(key)) {
      this.p2.delete(key);
      this.p2.set(key, true);
    } else if (this.t1.has(key)) {
      this.t1.delete(key);
      this.t2.set(key, true);
      this.adjust();
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

    if (this.p1.size + this.t1.size >= this.size) {
      if (this.p1.size > 0) {
        if (this.p1.size >= this.t1.size) {
          const delKey = this.p1.keys().next().value;
          this.p1.delete(delKey);
        } else {
          const delKey = this.t1.keys().next().value;
          this.t1.delete(delKey);
        }
      }
    }

    this.cache.set(key, value);
    this.p1.set(key, true);
    this.adjust();
  }

  /**
   * Delete key from cache
   * @param {string|number} key - The key to delete
   */
  delete(key) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
      this.p1.delete(key);
      this.p2.delete(key);
      this.t1.delete(key);
      this.t2.delete(key);
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
    this.p1.clear();
    this.p2.clear();
    this.t1.clear();
    this.t2.clear();
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

  /**
   * Adjust cache boundaries between p1/p2 and t1/t2 lists
   * Maintains adaptive balance based on access patterns
   */
  adjust() {
    const delta = Math.max(this.p1.size - this.p2.size, 0) / 2;
    const targetP1Size = Math.floor((this.#size - delta) / 2);

    while (this.p1.size > targetP1Size) {
      const key = this.p1.keys().next().value;
      this.p1.delete(key);
      this.t1.set(key, true);
    }

    const targetP2Size = this.#size - targetP1Size;
    while (this.p2.size > targetP2Size) {
      const key = this.p2.keys().next().value;
      this.p2.delete(key);
      this.t2.set(key, true);
    }
  }
}

/**
 * Factory function to create an ARC cache instance
 * @param {Object} [options={}] - Configuration options
 * @param {number} [options.size=100] - Maximum cache size
 * @returns {ARC} - New ARC cache instance
 */
export function arc(options = {}) {
  return new ARC(options.size || 100);
}
