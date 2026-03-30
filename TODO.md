# ARC Implementation Audit TODO

## Audit Reference
- **Source**: `src/arc.js`
- **Reference**: https://en.wikipedia.org/wiki/Adaptive_replacement_cache
- **Audit Date**: 2026-03-30

---

## Issues to Fix

### 1. [HIGH] `get()` method violates ARC algorithm
**Location**: `src/arc.js:27-41`

**Issue**: The `get()` method moves entries from T1→T2 on every access. According to ARC, entries only move from T1→T2 when they are *re-accessed via `set()`*, not on every `get()`. This breaks the "recently used" (T1) vs "frequently used" (T2) distinction.

**Expected behavior**: `get()` should only return the value and refresh LRU position within the same list. T1→T2 promotion happens in `set()` when the key already exists in cache.

**Status**: ✅ Fixed

**Fix applied**:
- `get()` now only refreshes position within the same list (T1→T1 or T2→T2)
- `set()` promotes T1→T2 when updating an existing key

---

### 2. [HIGH] Cache miss eviction logic is inverted
**Location**: `src/arc.js:90-125`

**Issue**: The eviction condition uses `p` value incorrectly. According to ARC:
- If `|B1| < |B2|`: evict from T1 (frequent list is losing more, grow recent list)
- If `|B1| >= |B2|`: evict from T2 (recent list is losing more, grow frequent list)
- If both ghost lists empty: default to T1 (LRU behavior)

**Status**: ✅ Fixed

**Fix applied**:
- Eviction now based on comparing ghost list sizes |B1| vs |B2|
- Added fallback when preferred list is empty
- Added safety break to prevent infinite loop

---

### 3. [HIGH] `delete()` method breaks ARC balance
**Location**: `src/arc.js:154-165`

**Issue**: Naive deletion from all lists (t1, t2, b1, b2) destroys the ghost list history that ARC relies on for adaptation. When deleting from B1, the algorithm was incorrectly adjusting `p` and evicting from T2→B2, treating delete like a ghost hit.

**Expected behavior**: `delete()` should simply remove the key from all lists without any compensation logic. Ghost list entries are just metadata tracking eviction history; deleting them shouldn't trigger the same logic as a ghost hit.

**Status**: ✅ Fixed

**Fix applied**:
- `delete()` now simply removes the key from cache and all lists
- No p-adjustment or eviction compensation
- Tests updated to reflect correct behavior

---

### 4. [HIGH] B1 ghost hit p-adjustment formula
**Location**: `src/arc.js:56-58`

**Issue**: The formula `p + Math.floor(this.b2.size / Math.max(1, this.b1.size))` uses division when it should use the ratio directly. Per ARC: `p = min(c, p + |B2|/|B1|)` where the division represents a ratio, not integer division for the adjustment.

**Status**: ⏳ Pending

---

### 5. [HIGH] B2 ghost hit p-adjustment formula
**Location**: `src/arc.js:70-71`

**Issue**: Similar to B1, the formula `p - Math.floor(this.b1.size / Math.max(1, this.b2.size))` may not correctly implement `p = max(0, p - |B1|/|B2|)`.

**Status**: ⏳ Pending

---

### 6. [MEDIUM] Missing edge case handling
**Location**: `src/arc.js:85-102, 56-76`

**Issue**: No guards against:
- Empty T1/T2 during eviction (could cause undefined behavior)
- Division by zero in p adjustments (already partially handled with `Math.max(1, ...)`)

**Status**: ⏳ Pending

---

### 7. [MEDIUM] Verify B1 ghost hit evicts from T2
**Location**: `src/arc.js:61-65`

**Issue**: When B1 ghost hit occurs, should evict from T2→B2. Current code does this, but need to verify it handles empty T2 correctly.

**Status**: ⏳ Pending

---

### 8. [MEDIUM] Verify B2 ghost hit evicts from T1
**Location**: `src/arc.js:73-76`

**Issue**: When B2 ghost hit occurs, should evict from T1→B1. Current code does this, but need to verify it handles empty T1 correctly.

**Status**: ⏳ Pending

---

### 9. [HIGH] Add comprehensive ARC algorithm tests
**Location**: `tests/unit/arc.test.js`

**Issue**: Current tests don't verify:
- Correct ghost hit behavior (B1/B2)
- Proper p-adjustment after ghost hits
- Correct eviction based on ghost list sizes
- T1/T2 balance maintenance

**Status**: ⏳ Pending

---

### 10. [MEDIUM] Fix existing tests that expect incorrect behavior
**Location**: `tests/unit/arc.test.js:198-219, 260-266, 282-292`

**Issue**: Tests expect T1→T2 promotion on `get()` calls, which is incorrect per ARC algorithm. These need to be updated to match correct behavior.

**Status**: ⏳ Pending

---

## Progress

| # | Issue | Priority | Status |
|---|-------|----------|--------|
| 1 | `get()` method violation | HIGH | ⏳ Pending |
| 2 | Cache miss eviction logic | HIGH | ⏳ Pending |
| 3 | `delete()` method balance | HIGH | ⏳ Pending |
| 4 | B1 ghost hit p-adjustment | HIGH | ⏳ Pending |
| 5 | B2 ghost hit p-adjustment | HIGH | ⏳ Pending |
| 6 | Edge case handling | MEDIUM | ⏳ Pending |
| 7 | B1 ghost hit T2 eviction | MEDIUM | ⏳ Pending |
| 8 | B2 ghost hit T1 eviction | MEDIUM | ⏳ Pending |
| 9 | Comprehensive tests | HIGH | ⏳ Pending |
| 10 | Fix existing tests | MEDIUM | ⏳ Pending |

---

## Notes

- Start with item #1 and work through sequentially
- Run `npm test` after each fix to verify
- Update this file as issues are resolved
