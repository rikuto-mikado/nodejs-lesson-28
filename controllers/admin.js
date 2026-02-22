const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        // Here shouldn't be changes to 'edit-product' because we are reusing the same template
        path: '/admin/add-product',
        editing: false
    });
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    // Pass null as the id because this is a new product — the id doesn't exist yet.
    // In save(), if this.id is null (falsy), it takes the else branch and generates a new id automatically.
    const product = new Product(null, title, imageUrl, description, price);
    product.save();

    res.redirect('/');
};

// Edit product page handler
exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }
    const prodId = req.params.productId;
    // Find the product by ID using Array.find() to get the specific product to edit
    // findById is a static method in Product model that reads all products and filters by ID
    // Other array selection methods: filter() (returns all matches), findIndex() (returns index), some() (returns boolean)
    Product.findById(prodId, product => {
        if (!product) {
            return res.redirect('/');
        }
        res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        // Pass the edit query param to tell the template if we're in edit mode
        editing: editMode,
        product: product
    });
    })
};

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDesc = req.body.description;
    // Create a new Product instance with the existing id and updated form values
    const updatedProduct = new Product(prodId, updatedTitle, updatedImageUrl, updatedDesc, updatedPrice);
    // save() sees that this.id exists (prodId), so it overwrites the matching product in the file
    updatedProduct.save();
    // After saving, redirect back to the admin product list
    res.redirect('/admin/products');
}

exports.getProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('admin/products', {
            prods: products,
            pageTitle: 'Admin Products',
            path: 'admin/products'
        });
    });
};

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
}