# Code Style Guide

This document outlines the coding conventions and style guidelines for the `tiny-arc` project.

## Overview

The project follows a consistent code style enforced by:
- **Oxlint** for linting
- **Oxfmt** for formatting

## Formatting

### Indentation

Use tabs for indentation, not spaces.

```javascript
// Correct
export class ARC {
	#size;

	constructor(size = 100) {
		this.#size = size;
	}
}

// Incorrect
export class ARC {
    #size;

    constructor(size = 100) {
        this.#size = size;
    }
}
```

### Line Length

Keep lines under 100 characters when possible. Use line breaks for long expressions.

```javascript
// Correct
const delKey =
    this.p1.keys().next().value ??
    this.t1.keys().next().value ??
    this.p2.keys().next().value ??
    this.t2.keys().next().value;

// Incorrect
const delKey = this.p1.keys().next().value ?? this.t1.keys().next().value ?? this.p2.keys().next().value ?? this.t2.keys().next().value;
```

###_QUOTES

Use double quotes for strings.

```javascript
// Correct
const message = "ARC cache initialized";

// Incorrect
const message = 'ARC cache initialized';
```

## Naming Conventions

### Class Names

Use PascalCase for class names.

```javascript
export class ARC {
	// ...
}
```

### Method Names

Use camelCase for method names.

```javascript
get(key) {
	set(key, value) {
	delete(key) {
	has(key) {
	clear() {
	}
```

### Property Names

- **Public properties**: camelCase (e.g., `cache`, `p1`, `p2`)
- **Private properties**: `#` prefix with camelCase (e.g., `#size`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `DEFAULT_SIZE`)

### Variable Names

Use descriptive camelCase names.

```javascript
const delKey = /* ... */;
const targetP1Size = /* ... */;
const maxCacheSize = /* ... */;
```

## Structure

### File Organization

Each file should follow this order:

1. File header comment
2. Exported class/function definitions
3. JSDoc comments for all public APIs

### Class Members

Order class members by visibility and type:

1. Private fields (`#size`)
2. Constructor
3. Methods (grouped logically)
4. Getters/setters

```javascript
export class ARC {
	#size;  // Private field

	constructor(size = 100) { /* ... */ }

	// Methods
	get(key) { /* ... */ }
	set(key, value) { /* ... */ }
	delete(key) { /* ... */ }
	has(key) { /* ... */ }
	clear() { /* ... */ }

	// Getters
	get size() { /* ... */ }
	get maxSize() { /* ... */ }
}
```

### JSDoc Comments

Document all public methods, properties, and the class itself with JSDoc.

```javascript
/**
 * Get value by key
 * @param {string|number} key - The key to retrieve
 * @returns {any|undefined} - The cached value or undefined
 */
get(key) {
	// ...
}

/**
 * ARC (Adaptive Replacement Cache) implementation
 * Dynamically adapts to access patterns to maximize hit rates
 */
export class ARC {
	// ...
}
```

Parameter documentation format:
- Required parameters: `@param {type} name - Description`
- Optional parameters: `@param {type} [name=default] - Description`

### Return Value Documentation

Document return types and descriptions for all methods.

```javascript
/**
 * @param {string|number} key - The key to retrieve
 * @returns {any|undefined} - The cached value or undefined
 */
get(key) {
	// ...
}
```

## Imports and Exports

### Import Order

1. Built-in Node.js modules (if any)
2. Local imports
3. Relative imports

### Export Style

Use named exports for all public APIs.

```javascript
export class ARC {
	// ...
}

export function arc(options = {}) {
	// ...
}
```

### Default Exports

Avoid default exports. Use named exports instead.

## Control Flow

### If Statements

Use `else if` for multiple conditions.

```javascript
// Correct
if (this.p1.has(key)) {
	this.p1.delete(key);
} else if (this.p2.has(key)) {
	this.p2.delete(key);
} else if (this.t1.has(key)) {
	this.t1.delete(key);
} else if (this.t2.has(key)) {
	this.t2.delete(key);
}

// Avoid
if (this.p1.has(key)) {
	this.p1.delete(key);
} else {
	if (this.p2.has(key)) {
		this.p2.delete(key);
	} else {
		// ...
	}
}
```

### Loops

Use `while` for conditions that may change inside the loop.

```javascript
while (this.p1.size > targetP1Size) {
	const key = this.p1.keys().next().value;
	this.p1.delete(key);
}
```

## Error Handling

### Return vs Throw

For cache operations, return `undefined` or `false` rather than throwing errors.

```javascript
// Correct
get(key) {
	if (!this.cache.has(key)) {
		return undefined;
	}
	return this.cache.get(key);
}

// Avoid
get(key) {
	if (!this.cache.has(key)) {
		throw new Error('Key not found');
	}
	return this.cache.get(key);
}
```

## Documentation

### Inline Comments

Use comments to explain *why* something is done, not *what*.

```javascript
// Correct
// Evict oldest entries when exceeding capacity
while (this.cache.size >= this.#size) {
	// ...
}

// Incorrect
while (this.cache.size >= this.#size) {
	// While loop to check size
	// ...
}
```

### Comment Style

- Use sentence case for comments
- End comments with a period
- Keep comments concise

## Testing

### Test File Naming

Test files use `.test.js` suffix.

```
tests/unit/arc.test.js
tests/unit/exports.test.js
```

### Test Structure

Organize tests by functionality:

```javascript
test('ARC class - constructor', () => {
	// ...
});

test('ARC class - get and set', () => {
	// ...
});

test('ARC class - delete', () => {
	// ...
});
```

## Code Quality

### Avoid Magic Numbers

Use named constants instead of magic numbers.

```javascript
// Correct
const DEFAULT_SIZE = 100;
constructor(size = DEFAULT_SIZE) { /* ... */ }

// Incorrect
constructor(size = 100) { /* ... */ }
```

### Use Nullish Coalescing

Prefer `??` over `||` for null/undefined checks.

```javascript
// Correct
return new ARC(options.size ?? 100);

// Avoid
return new ARC(options.size || 100);
```

### Consistent Quote Usage

Prefer single quotes for strings when not using template literals.

```javascript
// Correct
const key = 'myKey';
const value = 'myValue';

// When template literals needed
const message = `Cache size: ${size}`;
```

## Build and Linting

### Before Commit

Always run before committing:

```bash
npm run fix
npm run test
```

### Linting Rules

The project enforces these rules via Oxlint:

- `no-console`: Disallow `console` usage in production code
- `no-unused-vars`: disallow unused variables
- `no-duplicate-imports`: disallow duplicate imports
- `no-useless-constructor`: disallow unnecessary constructors

### Formatting

Oxfmt enforces consistent formatting. Always run:

```bash
npm run fix
```

## Examples

### Complete Class Example

```javascript
/**
 * ARC (Adaptive Replacement Cache) implementation
 * Dynamically adapts to access patterns to maximize hit rates
 */
export class ARC {
	#size;

	/**
	 * @param {number} [size=100] - Maximum cache size
	 */
	constructor(size = 100) {
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

		while (this.cache.size >= this.#size) {
			const delKey =
				this.p1.keys().next().value ??
				this.t1.keys().next().value ??
				this.p2.keys().next().value ??
				this.t2.keys().next().value;
			if (delKey !== undefined) {
				this.p1.delete(delKey);
				this.p2.delete(delKey);
				this.t1.delete(delKey);
				this.t2.delete(delKey);
				this.cache.delete(delKey);
			} else {
				break;
			}
		}

		this.cache.set(key, value);
		this.p1.set(key, true);
		this.adjust();
	}
}
```

### Complete Factory Example

```javascript
/**
 * Factory function to create an ARC cache instance
 * @param {Object} [options={}] - Configuration options
 * @param {number} [options.size=100] - Maximum cache size
 * @returns {ARC} - New ARC cache instance
 */
export function arc(options = {}) {
	return new ARC(options.size || 100);
}
```
