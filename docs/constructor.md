# `constructor()` — Create a Product Instance

> Location: `models/product.js`

## Source Code

```js
module.exports = class Product {
    constructor(id, title, imageUrl, description, price) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }
    // ...
}
```

## Explanation

The constructor is called whenever `new Product(...)` is used. It takes the arguments and assigns them to `this` (the new instance).

```js
const p = new Product(null, "Phone", "http://img.png", "A nice phone", 299);

// Result:
// p.id          → null   (new product, no ID yet)
// p.title       → "Phone"
// p.imageUrl    → "http://img.png"
// p.description → "A nice phone"
// p.price       → 299
```

### When is `id` null vs a value?

| Scenario | `id` value | What happens in `save()` |
| -------- | ---------- | ------------------------ |
| Creating a new product | `null` | Generates a new ID with `Math.random()` |
| Editing an existing product | `"0.123..."` | Finds and replaces the existing entry |

### `this` keyword

`this` refers to the **current instance** of the class:

```js
const a = new Product(null, "Book", ...);
const b = new Product(null, "Pen", ...);

// a.title → "Book"  (this = a)
// b.title → "Pen"   (this = b)
```
