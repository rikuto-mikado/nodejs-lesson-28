# Lesson 28 - Edit Product & Dynamic Routes

## What I Learned

- **Dynamic route params** — Express lets you define a URL segment as a variable with `:paramName`. The value is available in the controller via `req.params.paramName`.
- **Query strings** — `?editing=true` appended to a URL is read via `req.query.editing`. Used here to tell the template whether to render "Add" or "Edit" mode.
- **Edit flow pattern** — Two routes share the same form template:
  1. `GET /admin/edit-product/:productId?editing=true` → load product data, pre-fill the form
  2. `POST /admin/edit-product` → read form data, save (update) the product
- **Hidden input** — The product ID is passed through the form using `<input type="hidden">` so the POST handler knows which product to update.
- **Single template for Add & Edit** — One EJS file handles both modes. An `editing` boolean flag switches labels, button text, and whether fields are pre-filled.
- **`save()` as upsert** — The model's `save()` method acts as an upsert: it updates if `this.id` exists, otherwise creates a new product.

## Tricky Parts

### EJS Tag Differences

| Tag      | Purpose                  | Example                      |
| -------- | ------------------------ | ---------------------------- |
| `<% %>`  | Execute code (no output) | `<% if (editing) { %>`       |
| `<%= %>` | Output escaped value     | `<%= product.title %>`       |
| `<%- %>` | Output unescaped HTML    | `<%- include('head.ejs') %>` |

### Conditional Value in Attributes

Both approaches work for outputting a value conditionally:

```ejs
<!-- Approach 1: if block -->
<input value="<% if (editing) { %><%= product.title %><% } %>">

<!-- Approach 2: ternary (shorter) -->
<input value="<%= editing ? product.title : '' %>">
```

### Passing Variables to Templates

Every variable used in the template **must** be passed from the controller. Forgetting to pass `editing` in the "Add" route caused a `ReferenceError`.

```js
// Bad - missing editing
res.render("admin/edit-product", { pageTitle: "Add Product" });

// Good
res.render("admin/edit-product", { pageTitle: "Add Product", editing: false });
```

### Product Update Logic in `save()`

The `save()` method in `models/product.js` handles both **creating** and **updating** a product:

```js
if (this.id) {
    // 1. Find the index of the existing product in the array
    const existingProductIndex = products.findIndex(prod => prod.id === this.id);
    // 2. Create a shallow copy of the products array (to avoid mutating the original)
    const updatedProducts = [...products];
    // 3. Replace the old product with the updated one
    updatedProducts[existingProductIndex] = this;
}
```

**Step-by-step breakdown:**

| Step | Code | What it does |
| ---- | ---- | ------------ |
| 1 | `this.id` | Checks if the product already has an ID (= it exists in the file) |
| 2 | `findIndex(prod => prod.id === this.id)` | Searches the array and returns the position (index) of the matching product |
| 3 | `[...products]` | Spread syntax — creates a **copy** of the array so we don't mutate the original |
| 4 | `updatedProducts[existingProductIndex] = this` | Overwrites the old product at that index with the current instance (`this`) |

**Flow diagram:**

```
save() called
    │
    ├── this.id exists? ──► YES (Update)
    │       1. Find index of existing product
    │       2. Copy the array
    │       3. Replace product at that index
    │       4. Write updated array to file
    │
    └── this.id is null? ──► NO (Create)
            1. Generate a new random ID
            2. Push new product to array
            3. Write array to file
```

### Alternative Ways to Update an Item in an Array

The approach used in this project (copy + replace by index) is just one way. Here are all the common patterns:

---

#### 1. Spread copy + index replacement (this project's approach)

```js
const index = products.findIndex(p => p.id === id);
const updated = [...products];
updated[index] = newProduct;
```

- Creates a copy, then overwrites at the found index
- **Pros:** Simple, easy to understand
- **Cons:** Two steps needed (find index, then replace)

---

#### 2. `map()` — return a new array with the item swapped

```js
const updated = products.map(p => p.id === id ? newProduct : p);
```

- Loops through every item. If the ID matches, return the new data; otherwise keep the original
- **Pros:** Single expression, no index needed, always returns a new array (immutable)
- **Cons:** Iterates the entire array even after finding the match

---

#### 3. Direct index mutation (simplest but mutates original)

```js
const index = products.findIndex(p => p.id === id);
products[index] = newProduct;
```

- Finds the index and directly overwrites the original array
- **Pros:** Fewest lines, most straightforward
- **Cons:** Mutates the original array — can cause unexpected side effects

---

#### 4. `splice()` — remove and insert in place

```js
const index = products.findIndex(p => p.id === id);
products.splice(index, 1, newProduct);
```

- Removes 1 item at `index` and inserts `newProduct` in its place
- **Pros:** One method call, keeps the same array reference
- **Cons:** Mutates the original array

---

#### 5. `filter()` + `push()` — remove old, add new

```js
const updated = products.filter(p => p.id !== id);
updated.push(newProduct);
```

- Removes the old item by filtering it out, then pushes the new one
- **Pros:** Simple to read
- **Cons:** Changes the item's position (moves it to the end), iterates entire array

---

#### Comparison table

| Approach | Mutates original? | Keeps position? | Lines of code | Best for |
| -------- | ----------------- | --------------- | ------------- | -------- |
| Spread + index | No | Yes | 3 | Safe update (this project) |
| `map()` | No | Yes | 1 | React/Redux state updates |
| Direct index | **Yes** | Yes | 2 | Quick scripts, prototyping |
| `splice()` | **Yes** | Yes | 2 | When mutation is OK |
| `filter()` + `push()` | No | **No** | 2 | When order doesn't matter |

> **Key takeaway:** In frameworks like React/Redux where immutability matters, `map()` is the go-to pattern.
> For simple Node.js file-based storage like this project, spread + index or direct mutation both work fine.

## Memo

### Dynamic route params vs query strings

| | Syntax | Read via | Example |
|---|---|---|---|
| Route param | `/products/:id` | `req.params.id` | `/products/0.123` |
| Query string | `/products?editing=true` | `req.query.editing` | `/products?editing=true` |

Route params are for **identity** (which resource). Query strings are for **modifiers** (what to do with it).

### Unary `+` for string-to-number conversion

In `cart.js`, `+productPrice` converts the price string from `req.body` to a number before arithmetic:

```js
cart.totalPrice = cart.totalPrice + +productPrice;
//                                  ↑
//                         converts string → number
```

Without it, `+` would concatenate strings instead of adding numbers.
