# test262 (vendored)

This directory contains curated slices of the official ECMAScript conformance
suite, **[tc39/test262](https://github.com/tc39/test262)**, used to exercise the
watjs engine.

- `harness/` — the official test harness files (`sta.js`, `assert.js`, etc.).
- `batch/`, `broad/`, `broad2/`, `broad3/`, `cases/` — selected test files.

## Attribution & license

These files are the work of **Ecma International** and the tc39/test262
contributors, not of watjs. Each file retains its original header:

```
// Copyright (c) 2012 Ecma International.  All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.
```

The referenced license is included here as [`LICENSE`](./LICENSE) (the test262
BSD license). It governs everything in this directory and applies independently
of the MIT license covering the rest of the watjs repository.

The runner (`../tools/test262.js`) and everything under `../src` are watjs's own
work under the repository's [MIT license](../LICENSE).
