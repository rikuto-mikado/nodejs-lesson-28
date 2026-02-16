# `static fetchAll(cb)` — Get All Products

> Location: `models/product.js`

## Source Code

```js
static fetchAll(cb) {
    getProductsFromFile(cb);
}
```

## Explanation

This is a **static method** — called on the class itself, not on an instance:

```js
// Called like this (no `new` needed):
Product.fetchAll((products) => {
    console.log(products);
});

// NOT like this:
// const p = new Product();
// p.fetchAll();  ← wrong
```

### Flow

```
Product.fetchAll(callback)
        │
        ▼
getProductsFromFile(callback)
        │
        ▼
fs.readFile('data/products.json')
        │
        ├── Error  → callback([])          ← return empty array
        └── Success → callback(parsed JSON) ← return all products
```

### Why use a callback?

`fs.readFile` is **asynchronous** — it doesn't return the data immediately. So we pass a callback function that gets called once the file has been read.

```js
// This does NOT work (readFile is async):
static fetchAll() {
    let result;
    fs.readFile(p, (err, data) => {
        result = JSON.parse(data);  // runs later
    });
    return result;  // undefined! (runs first)
}

// This works (callback pattern):
static fetchAll(cb) {
    fs.readFile(p, (err, data) => {
        cb(JSON.parse(data));  // call back with the data when ready
    });
}
```
