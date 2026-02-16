# `static findById(id, cb)` — Find a Single Product by ID

> Location: `models/product.js`

## Source Code

```js
static findById(id, cb) {
    getProductsFromFile((products) => {
        const product = products.find(p => p.id === id);
        cb(product);
    });
}
```

## Explanation

Another **static method** that reads all products from the file, then filters down to one.

### Flow

```
Product.findById("0.123", callback)
        │
        ▼
getProductsFromFile(...)
        │
        ▼
products = [ {id:"0.111",...}, {id:"0.123",...}, {id:"0.999",...} ]
                                     ▲
                              .find() matches!
        │
        ▼
callback( {id:"0.123", title:"Phone", ...} )
```

### `find()` vs `findIndex()` vs `filter()`

| Method | Returns | Use when |
| ------ | ------- | -------- |
| `find(fn)` | The **first matching item** (or `undefined`) | You want the object itself |
| `findIndex(fn)` | The **index** of the first match (or `-1`) | You need the position to update/remove |
| `filter(fn)` | A **new array** of all matches | There could be multiple matches |

```js
const products = [{id:"1"}, {id:"2"}, {id:"3"}];

products.find(p => p.id === "2");       // → {id:"2"}
products.findIndex(p => p.id === "2");  // → 1
products.filter(p => p.id === "2");     // → [{id:"2"}]
```

### Why `find()` here and `findIndex()` in `save()`?

- **`findById`** needs the **product object** to pass to the view → `find()`
- **`save`** needs the **position (index)** to replace the item in the array → `findIndex()`
