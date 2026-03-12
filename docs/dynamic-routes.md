# Dynamic Routes & Query Strings

## Route Params (`:paramName`)

Define a variable segment in the route path with `:`:

```js
// routes/admin.js
router.get('/edit-product/:productId', adminController.getEditProduct);
```

Access it in the controller via `req.params`:

```js
// controllers/admin.js
exports.getEditProduct = (req, res, next) => {
    const prodId = req.params.productId;
    // ...
};
```

## Query Strings (`?key=value`)

Append `?key=value` to the URL to pass optional data:

```html
<!-- views: link to edit page -->
<a href="/admin/edit-product/<%= product.id %>?editing=true">Edit</a>
```

Access it via `req.query`:

```js
const editing = req.query.editing; // "true" (string)
```

> Note: `req.query` values are always **strings**. Use `=== 'true'` or convert explicitly.

## Params vs Query Strings

| | Syntax | Read via | Use for |
|---|---|---|---|
| Route param | `/products/:id` | `req.params.id` | Identity — which resource |
| Query string | `/products?editing=true` | `req.query.editing` | Modifier — what to do with it |

## Edit Flow in This Project

```
GET /admin/edit-product/:productId?editing=true
    │
    ├── req.params.productId  → which product to load
    └── req.query.editing     → tell the template to show edit UI

POST /admin/edit-product
    │
    └── req.body.productId    → hidden input carries the ID through the form
```

The hidden input in the form bridges the GET (load) and POST (save) steps:

```html
<input type="hidden" name="productId" value="<%= product.id %>">
```
