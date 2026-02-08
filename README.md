# Lesson 28 - Edit Product & Dynamic Routes

## What I Learned

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

## Memo
