# `getProductsFromFile(cb)` — Read Products from JSON File

> Location: `models/product.js` (top-level helper function)

## Source Code

```js
const p = path.join(
    path.dirname(require.main.filename),
    'data',
    'products.json'
);

const getProductsFromFile = (cb) => {
    fs.readFile(p, (err, fileContent) => {
        if (err) {
            cb([]);
        } else {
            cb(JSON.parse(fileContent));
        }
    });
};
```

## Explanation

This is a **helper function** (not part of the class) that reads `data/products.json` and passes the result to a callback.

### Flow

```
getProductsFromFile(callback)
        │
        ▼
fs.readFile('data/products.json')
        │
        ├── Error (file doesn't exist, etc.)
        │       └── callback([])              ← empty array as fallback
        │
        └── Success
                └── callback(JSON.parse(...)) ← parsed array of products
```

### Path construction

```js
const p = path.join(
    path.dirname(require.main.filename),  // project root directory
    'data',                                // data folder
    'products.json'                        // the JSON file
);
// Example result: /Users/you/project/data/products.json
```

| Part | What it does |
| ---- | ------------ |
| `require.main.filename` | The entry point file (e.g. `app.js`) |
| `path.dirname(...)` | Gets the directory of that file (project root) |
| `path.join(...)` | Joins path segments with the correct separator (`/` or `\`) |

### Why a callback and not `return`?

`fs.readFile` is asynchronous. The data isn't available immediately:

```
Timeline:
────────────────────────────────────►
  │                        │
  readFile called          data ready (callback fires)
  │                        │
  return here? → undefined!
```

So instead of returning, we pass a **callback** that gets called when the data is ready.

### Why is this not inside the class?

It's a **private helper** — only used internally by `save()`, `fetchAll()`, and `findById()`. It doesn't need access to `this`, so there's no reason to make it a class method. Keeping it outside the class keeps the code cleaner.
