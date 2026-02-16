const fs = require('fs');
const path = require('path');

const p = path.join(
    path.dirname(require.main.filename),
    'data',
    'products.json'
);

const getProductsFromFile = (cb) => {
    fs.readFile(p, (err, fileContent) => {
        if (err) {
            cb([]);
        } else {
            cb(JSON.parse(fileContent));
        }
    });
}

module.exports = class Product {
    constructor(id, title, imageUrl, description, price) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        getProductsFromFile((products) => {
            // If the product already has an ID, it exists in the file — so we update it
            if (this.id) {
                // Search the array for the product with the same ID and get its position (index)
                const existingProductIndex = products.findIndex(prod => prod.id === this.id);
                // Create a shallow copy of the array using spread syntax to avoid mutating the original
                const updatedProducts = [...products];
                // Overwrite the old product data at that index with the current instance (this)
                updatedProducts[existingProductIndex] = this;
            } else {
                // No ID exists — this is a new product, so we fall through to create it below
            }
            this.id = Math.random().toString();
            products.push(this);
            fs.writeFile(p, JSON.stringify(products), err => {
                console.log(err);
            });
        });
    }

    static fetchAll(cb) {
        getProductsFromFile(cb);
    }

    static findById(id, cb) {
        getProductsFromFile((products) => {
            const product = products.find(p => p.id === id);
            cb(product);
        })
    }
}
