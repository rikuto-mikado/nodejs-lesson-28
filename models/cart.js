const fs = require('fs');
const path = require('path');

const p = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'cart.json'
);

module.exports = class Cart {
    static addProduct(id, productPrice) {
        // Fetch the previous cart
        fs.readFile(p, (err, fileContent) => {
            let cart = { products: [], totalPrice: 0 };
            if (!err) {
                // If there is no error, we have some previous cart
                cart = JSON.parse(fileContent);
            }
            // Also analyze the cart and find existing product
            const existingProductIndex = cart.products.findIndex(prod => prod.id === id);
            const existingProduct = cart.products[existingProductIndex];
            let updatedProduct;
            // If the product is already in the cart
            if (existingProductIndex >= 0) {
                // Copy existing product and increment qty
                updatedProduct = { ...existingProduct };
                updatedProduct.qty = updatedProduct.qty + 1;
                // Replace product immutably
                cart.products = [...cart.products];
                cart.products[existingProductIndex] = updatedProduct;
            } else {
                // Add new product with qty of 1
                updatedProduct = { id: id, qty: 1 };
                cart.products = [...cart.products, updatedProduct];
            }
            // Update total price
            cart.totalPrice = cart.totalPrice + +productPrice;
            fs.writeFile(p, JSON.stringify(cart), err => {
                console.log(err);
            })
        });
    }

    static deleteProduct(id, productPrice) {
        fs.readFile(p, (err, fileContent) => {
            if (err) {
                return;
            }
            // JSON.parse is required to convert the raw Buffer/string from fs.readFile into a JavaScript object.
            // Without it, fileContent remains a Buffer and accessing properties like .products would throw a TypeError.
            const updatedCart = { ...JSON.parse(fileContent) };
            productIndex = updatedCart.products.findIndex(
                prod => prod.id === id
            );
            const productQty = product.qty;
            updatedCart.products = updatedCart.products.filter(
                prod => prod.id !== id
            );
            updatedCart.totalPrice = updatedCart.totalPrice - productPrice * productQty;

            fs.writeFile(p, JSON.stringify(updatedCart), err => {
                console.log(err);
            });
        });
    }

    // Read-only method that retrieves the current cart data from the file.
    // Used when rendering the cart page to display what products are currently in the cart.
    // Passes null to the callback if the file doesn't exist, or the parsed cart object if it does.
    static getCart(cb) {
        fs.readFile(p, (err, fileContent) => {
            if (err) {
                cb(null)
            } else {
                const cart = JSON.parse(fileContent);
                cb(cart);
            }
        });
    }
};