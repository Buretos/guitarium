const Product = require('../models/Product');
const CATEGORIES = require('../constants/categories');

// add
async function addProduct(product) {
	const newProduct = await Product.create(product);

	await newProduct.populate({
		path: 'comments',
		populate: 'author',
	});

	return newProduct;
}

// edit
async function editProduct(id, product) {
	const newProduct = await Product.findByIdAndUpdate(id, product, {
		returnDocument: 'after',
	});

	await newProduct.populate({
		path: 'comments',
		populate: 'author',
	});

	return newProduct;
}

// delete
function deleteProduct(id) {
	return Product.deleteOne({ _id: id });
}

// get list with search
async function getProducts(search = '') {
	const products = await Product.find({
		title: { $regex: search, $options: 'i' },
	}).populate({
		path: 'comments',
		populate: 'evaluation',
	});
	return products;
}

// get item
function getProduct(id) {
	return Product.findById(id).populate({
		path: 'comments',
		populate: 'author',
	});
}

function getCategories() {
	return [
		{ id: CATEGORIES.GUITAR, name: 'Гитары' },
		{ id: CATEGORIES.STRINGS, name: 'Струны' },
		{ id: CATEGORIES.ACCESSORY, name: 'Аксессуары' },
		{ id: CATEGORIES.LITERATURE, name: 'Литература' },
	];
}

module.exports = {
	addProduct,
	editProduct,
	deleteProduct,
	getProducts,
	getProduct,
	getCategories,
};
