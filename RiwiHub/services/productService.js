import Product from '../models/Product.js'; // Assuming you have a Product model defined

export const createProduct = async (productData) => {
    try {
        const product = await Product.create(productData);
        return product;
    } catch (error) {
        throw new Error('Error creating product: ' + error.message);
    }
};

export const getAllProducts = async () => {
    try {
        const products = await Product.findAll();
        return products;
    } catch (error) {
        throw new Error('Error fetching products: ' + error.message);
    }
};

export const getProductById = async (id) => {
    try {
        const product = await Product.findByPk(id);
        if (!product) {
            throw new Error('Product not found');
        }
        return product;
    } catch (error) {
        throw new Error('Error fetching product: ' + error.message);
    }
};

export const updateProduct = async (id, productData) => {
    try {
        const product = await Product.findByPk(id);
        if (!product) {
            throw new Error('Product not found');
        }
        await product.update(productData);
        return product;
    } catch (error) {
        throw new Error('Error updating product: ' + error.message);
    }
};

export const deleteProduct = async (id) => {
    try {
        const product = await Product.findByPk(id);
        if (!product) {
            throw new Error('Product not found');
        }
        await product.destroy();
        return { message: 'Product deleted successfully' };
    } catch (error) {
        throw new Error('Error deleting product: ' + error.message);
    }
};