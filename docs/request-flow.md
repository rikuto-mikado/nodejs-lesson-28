# Request Flow: Route → Controller → Response

## Overview

```
Browser → app.js → routes/shop.js → controllers/shop.js → HTML back to Browser
```

---

## Example: GET /cart

### ① app.js — Register the router

```js
// app.js L21
app.use(shopRoutes);
```

When a request comes in for `/cart`, it is handed off to `routes/shop.js`.

---

### ② routes/shop.js — Map URL to controller function

```js
// routes/shop.js L15
router.get('/cart', shopController.getCart);
//          ↑                    ↑
//    GET /cart matches      call this function
```

The route definition answers: "For which URL and HTTP method should which function be called?"

---

### ③ controllers/shop.js — Handle the logic and send a response

```js
// controllers/shop.js L36-53
exports.getCart = (req, res, next) => {
    Cart.getCart(cart => {               // fetch cart data
        Product.fetchAll(products => {   // fetch all products
            const cartProducts = [];
            for (product of products) {
                cartProductData = cart.products.find(prod => prod.id === product.id);
                if (cartProductData) {
                    cartProducts.push({productData: product, qty: cartProductData.qty});
                }
            }
            res.render('shop/cart', {    // ← render HTML and send response
                path: '/cart',
                pageTitle: 'Your Cart',
                products: cartProducts
            });
        });
    });
};
```

Fetch and process data, then call `res.render()` to generate HTML and send it back to the browser.

---

## Responsibilities

| File | Role |
|---|---|
| `app.js` | Register which routers to use |
| `routes/shop.js` | Map URLs to controller functions |
| `controllers/shop.js` | Business logic + sending the response |

---

## Full Flow Diagram

```
GET /cart request
    ↓
app.js → hands off to shopRoutes
    ↓
routes/shop.js → matches router.get('/cart', ...)
    ↓
controllers/shop.js → executes getCart()
    ↓
Fetch and process data from DB/file
    ↓
res.render('shop/cart', {...}) → generates HTML and sends to browser
```
