# AGENTS.md

## Project Overview

**ar-cache** - A minimal ARC (Adaptive Replacement Cache) implementation in JavaScript.

## Project Structure

```
/ar-cache/
├── src/
│   └── arc.js          # ARC class implementation
├── dist/               # Built output (generated)
│   ├── ar-cache.cjs    # CommonJS build
│   └── ar-cache.js     # ES Module build
├── tests/unit/         # Unit tests directory
├── node_modules/       # Dependencies (gitignored)
├── .gitignore
├── package.json
├── rollup.config.js    # Rollup bundler configuration
├── AGENTS.md           # This file
└── README.md           # (exists, see RTK.md references)
```

## Key Technologies

- **Runtime**: Node.js with ES Modules (`"type": "module"`)
- **Bundler**: Rollup for creating CJS and ESM builds
- **Linting/Formatting**: Oxlint and Oxfmt
- **Git Hooks**: Husky
- **Changelog**: Auto-changelog

## Commands

| Command | Description |
|---------|-------------|
| `npm run build` | Build the project using Rollup |
| `npm run rollup` | Run Rollup bundler |
| `npm run lint` | Run Oxlint linter and Oxfmt formatter check |
| `npm run fix` | Run Oxlint auto-fix and Oxfmt formatting |
| `npm run test` | Run linting then Node.js tests |
| `npm run coverage` | Run tests with coverage reporting |
| `npm run changelog` | Generate changelog with auto-changelog |

## Architecture

### ARC Class

The `ARC` class implements the Adaptive Replacement Cache algorithm:

- **Constructor**: `new ARC(size)` - Creates cache with given maximum size
- **get(key)**: Retrieve value, updates access patterns
- **set(key, value)**: Store value, maintains cache bounds
- **delete(key)**: Remove key from all internal lists
- **has(key)**: Check if key exists
- **adjust()**: Internal method to balance p1/p2 and t1/t2 lists

#### Important Notes on Delete Behavior

The `delete()` method currently performs a naive removal from all internal lists (t1, t2, b1, b2).
This can create an imbalance if:
- B2 has grown (via T2 evictions or B2 ghost hits)
- Multiple keys are deleted from B1

**Why this is a problem:**
According to the ARC algorithm, ghost lists act as "scorecards" tracking recent evictions. When you delete from B1:
- You lose track of entries that were evicted from T1
- B2 may still contain ghosts from T2 evictions
- The p boundary no longer has balanced history information
- This breaks the algorithm's adaptive balancing capability

**Potential fixes:**
- Move entries from B2 back to T2 when B1 is deleted (compensate for lost B1 history)
- Adjust the `p` boundary to compensate for the imbalance
- At minimum, document that `delete()` breaks ARC balance and may reduce cache efficiency

### Internal Lists

- **T1, T2**: Recently accessed item lists (T1=new, T2=old)
- **B1, B2**: Ghost lists (B1=ghosts from T1, B2=ghosts from T2)
- **p**: Boundary parameter that adapts between T1 and T2 dominance

#### Algorithm Behavior

Based on the [ARC algorithm](https://en.wikipedia.org/wiki/Adaptive_replacement_cache):

- **T1/B1** (L1): Track recently accessed entries
- **T2/B2** (L2): Track frequently accessed entries (re-referenced at least once)
- **p** controls the boundary between T1 and T2

**Ghost hit behavior:**
- **B1 ghost hit**: Entry re-entered that was evicted from T1 → Increase T1 size (p += |B2|/|B1|), evict T2→B2
- **B2 ghost hit**: Entry re-entered that was evicted from T2 → Decrease T1 size (p -= |B1|/|B2|), evict T1→B1
- **Cache miss**: Don't change p, just evict based on current balance

#### Architecture Notes

- Ghost lists only store keys/metadata, not full values
- Combined directory: B1 ← T1 ! T2 → B2 where ! is the cache boundary and ^ is target T1 size
- Entries move: T1→B1 when evicted, T1→T2 on second hit, T2→B2 when evicted from T2

## Build Process

1. Rollup reads `./src/arc.js` as entry point
2. Outputs two bundles to `dist/`:
   - `ar-cache.cjs` - CommonJS with named exports
   - `ar-cache.js` - ES Module with named exports
3. Both include generated banner with copyright info

## Development Workflow

1. Create feature branch from `init`
2. Implement changes in `src/arc.js`
3. Run tests: `npm run test`
4. Fix formatting: `npm run fix`
5. Build: `npm run build`
6. Commit changes with descriptive message
7. Push branch and create pull request

## Branch Strategy

- **init**: Current development branch
- **master**: Production (default, but using 'init' currently)

## Git Hooks

Husky is configured via `"prepare": "husky"` in package.json to run on npm install.

## Publishing

When ready to publish:
1. Bump version in package.json
2. Run `npm run changelog` to update changelog
3. Commit changes
4. Create release on GitHub

## Important Notes

- `node_modules` and `dist` are gitignored
- Package type is ESM (`"type": "module"`)
- Exports field in package.json defines dual CJS/ESM support
- Main entry points: `./dist/ar-cache.cjs` (require) and `./dist/ar-cache.js` (import)
