const Order = require('../models/Order');
const STATUS = require('../constants/status');
const User = require('../models/User');

// add
async function addOrder(order) {
	const newOrder = await Order.create(order);

	await newOrder.populate({
		path: 'userId',
		populate: 'login',
	});

	return newOrder;
}

// edit (status)
function updateOrder(id, orderData) {
	return Order.findByIdAndUpdate(id, orderData, { returnDocument: 'after' }).populate({
		path: 'userId',
		populate: 'login',
	});
}

// get list
function getOrders() {
	return Order.find().populate({
		path: 'userId',
		populate: 'login',
	});
}

// Обновлённый контроллер для печати всех заказов определённого пользователя по userId
async function getOrdersByUserId(userId) {
	const orders = await Order.find({ userId: userId }).populate('userId', 'login');
	return orders;
}

// Контроллер для получения заказов по логину пользователя
async function getOrdersByUserLogin(login) {
	const user = await User.findOne({ login }).exec(); // Находим пользователя по логину
	if (!user) {
		throw new Error('Пользователь не найден');
	}

	const orders = await Order.find({ userId: user._id }).populate('userId', 'login'); // Используем его _id для поиска заказов
	return orders;
}

function getStatus() {
	return [
		{ id: STATUS.CREATED, name: 'создан' },
		{ id: STATUS.DELIVERE, name: 'доставляется' },
		{ id: STATUS.DONE, name: 'вручён' },
		{ id: STATUS.CANCELED, name: 'отменён' },
	];
}

module.exports = {
	addOrder,
	updateOrder,
	getOrders,
	getStatus,
	getOrdersByUserId,
	getOrdersByUserLogin,
};
