const fs = require('fs');

const p = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'cart.json'
);

module.exports = class Cart {
    static addProduct(id) {
        // Fetch the previous cart
        fs.readFile(p, (err, fileContent) => {
            let cart = { products: [], totalPrice: 0 };
            if (!err) {
                // If there is no error, we have some previous cart
                cart = JSON.parse(fileContent);
            }
            // Also analyze the cart and find existing product
            const existingProductIndex = cart.products.find(prod => prod.id === id);
            let updatedProduct;
            // If the product is already in the cart
            if (existingProductIndex) {
                updatedProduct = { ...existingProductIndex };
                // Increment the quantity by 1 since the product already exists in the cart
                updatedProduct.qty = updatedProduct.qty + 1;
            } else {
                updatedProduct = { id: id, qty: 1 };
            }
        })
    }
};