# `save()` — Create or Update a Product

> Location: `models/product.js`

## Overview

The `save()` method handles both **creating a new product** and **updating an existing product** in a single method. It reads the current products from a JSON file, modifies the array, and writes it back.

## Source Code

```js
save() {
    getProductsFromFile((products) => {
        if (this.id) {
            const existingProductIndex = products.findIndex(prod => prod.id === this.id);
            const updatedProducts = [...products];
            updatedProducts[existingProductIndex] = this;
        } else {
            // new product — fall through to create
        }
        this.id = Math.random().toString();
        products.push(this);
        fs.writeFile(p, JSON.stringify(products), err => {
            console.log(err);
        });
    });
}
```

## Step-by-Step

### Update path (`this.id` exists)

```
this.id = "0.123456789"  (already assigned)
          │
          ▼
products = [ {id: "0.111", ...}, {id: "0.123", ...}, {id: "0.999", ...} ]
                                       ▲
                                  findIndex → 1
          │
          ▼
updatedProducts = [...products]   ← shallow copy
updatedProducts[1] = this         ← replace at index 1
```

| Line | Code | Purpose |
| ---- | ---- | ------- |
| 1 | `if (this.id)` | Does this product already exist? |
| 2 | `products.findIndex(prod => prod.id === this.id)` | Find its position in the array |
| 3 | `const updatedProducts = [...products]` | Copy the array (don't mutate original) |
| 4 | `updatedProducts[existingProductIndex] = this` | Swap old data with new data |

### Create path (`this.id` is falsy)

| Line | Code | Purpose |
| ---- | ---- | ------- |
| 1 | `this.id = Math.random().toString()` | Generate a random ID for the new product |
| 2 | `products.push(this)` | Add the new product to the end of the array |
| 3 | `fs.writeFile(...)` | Save the updated array to `products.json` |

## Alternative Approaches for the Update

See [array-update-patterns.md](./array-update-patterns.md) for all the different ways to update an item in an array.
