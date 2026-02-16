# Array Update Patterns

> How to update a single item inside an array — 5 different approaches

All examples assume:
```js
const products = [
    { id: "1", title: "Book" },
    { id: "2", title: "Phone" },
    { id: "3", title: "Pen" }
];
const id = "2";
const newProduct = { id: "2", title: "Laptop" };
```

---

## 1. Spread copy + index replacement

**Used in this project (`models/product.js`)**

```js
const index = products.findIndex(p => p.id === id);
const updated = [...products];
updated[index] = newProduct;
```

```
Before: [ Book, Phone, Pen ]
                 ▲
            index = 1
After:  [ Book, Laptop, Pen ]  (new array)
```

- Immutable (original array untouched)
- Keeps item position
- 3 lines

---

## 2. `map()` — swap while iterating

```js
const updated = products.map(p => p.id === id ? newProduct : p);
```

```
map loops through each item:
  "1" Book   → id !== "2" → keep  → Book
  "2" Phone  → id === "2" → swap  → Laptop
  "3" Pen    → id !== "2" → keep  → Pen

Result: [ Book, Laptop, Pen ]  (new array)
```

- Immutable
- Single expression — the most concise
- Go-to pattern in **React / Redux**

---

## 3. Direct index mutation

```js
const index = products.findIndex(p => p.id === id);
products[index] = newProduct;
```

```
Before: [ Book, Phone, Pen ]
                 ▲
After:  [ Book, Laptop, Pen ]  (same array, mutated)
```

- **Mutates** the original array
- Fewest lines, simplest
- OK for quick scripts or when the array won't be used elsewhere

---

## 4. `splice()` — remove and insert in place

```js
const index = products.findIndex(p => p.id === id);
products.splice(index, 1, newProduct);
//              ▲      ▲  ▲
//              |      |  └─ insert this
//              |      └─ remove 1 item
//              └─ starting at this index
```

```
Before: [ Book, Phone, Pen ]
splice(1, 1, Laptop)
After:  [ Book, Laptop, Pen ]  (same array, mutated)
```

- **Mutates** the original array
- One method call does both remove + insert
- Useful when you need the removed item (splice returns it)

---

## 5. `filter()` + `push()` — remove old, add new

```js
const updated = products.filter(p => p.id !== id);
updated.push(newProduct);
```

```
filter: keep everything except id "2"
  → [ Book, Pen ]

push: add Laptop to end
  → [ Book, Pen, Laptop ]    ← position changed!
```

- Immutable
- **Does NOT keep original position** (item moves to end)
- Simple but only use when order doesn't matter

---

## Comparison Table

| Approach | Mutates original? | Keeps position? | Lines | Best for |
| -------- | :---------------: | :-------------: | :---: | -------- |
| Spread + index | No | Yes | 3 | Safe update (this project) |
| `map()` | No | Yes | 1 | React / Redux state |
| Direct index | **Yes** | Yes | 2 | Quick scripts |
| `splice()` | **Yes** | Yes | 2 | When mutation is OK |
| `filter()` + `push()` | No | **No** | 2 | Order doesn't matter |

## Which Should I Use?

- **React / Redux / immutable state** → `map()`
- **Node.js file-based (like this project)** → Spread + index or direct mutation
- **Need the deleted item back** → `splice()`
- **Don't care about order** → `filter()` + `push()`
