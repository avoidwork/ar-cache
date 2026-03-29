# Tiny ARC

[![npm version](https://badge.fury.io/js/tiny-arc.svg)](https://badge.fury.io/js/tiny-arc)
[![License: BSD-3-Clause](https://img.shields.io/badge/License-BSD--3--Clause-blue.svg)](LICENSE)

A lightweight ARC cache implementation for Node.js and browsers.

## Features

- ✅ Adaptive Replacement Cache (ARC) algorithm
- ✅ Works in Node.js and browsers
- ✅ ES Modules & CommonJS support
- ✅ TypeScript type definitions included

## Installation

```bash
# npm
npm install tiny-arc

# pnpm
pnpm add tiny-arc

# yarn
yarn add tiny-arc
```

## Usage

### ES Modules

```js
import { ARC, arc } from 'tiny-arc';

// Direct class usage
const cache = new ARC(100);
cache.set('key', 'value');
console.log(cache.get('key'));

// Factory function
const cache2 = arc({ size: 100 });
```

### CommonJS

```js
const { ARC, arc } = require('tiny-arc');

const cache = arc({ size: 100 });
cache.set('key', 'value');
console.log(cache.get('key'));
```

## API

See [docs/API.md](docs/API.md) for full API documentation.

## Development

```bash
# Install dependencies
npm install

# Run linting
npm run lint

# Fix formatting
npm run fix

# Run tests
npm test

# Build
npm run build

# Generate changelog
npm run changelog
```

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting a PR.

## License

BSD-3-Clause - See [LICENSE](LICENSE) for details.

## Acknowledgments

- Inspired by the [Adaptive Replacement Cache](https://en.wikipedia.org/wiki/Adaptive_replacement_cache) algorithm
