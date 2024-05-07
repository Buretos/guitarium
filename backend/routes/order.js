const express = require('express');
const {
	addOrder,
	updateOrder,
	getOrders,
	getOrdersByUserId,
	getOrdersByUserLogin,
	getStatus,
} = require('../controllers/order');
const mapOrder = require('../helpers/mapOrder');
const authenticated = require('../middlewares/authenticated');
const hasRole = require('../middlewares/hasRole');
const ROLES = require('../constants/roles');

const router = express.Router({ mergeParams: true });

router.post('/', authenticated, hasRole([ROLES.CLIENT]), async (req, res) => {
	const newOrder = await addOrder({
		userId: req.user.id,
		productsInCart: req.body.productsInCart,
		paymentMethod: req.body.paymentMethod,
		deliveryMethod: req.body.deliveryMethod,
		countAll: req.body.countAll,
		totalAmount: req.body.totalAmount,
	});

	res.send({ data: mapOrder(newOrder) });
});

router.get('/status', authenticated, async (req, res) => {
	const status = getStatus();

	res.send({ data: status });
});

router.patch(
	'/:id',
	authenticated,
	hasRole([ROLES.SALESMAN, ROLES.ADMIN]),
	async (req, res) => {
		const newOrder = await updateOrder(req.params.id, {
			statusId: req.body.statusId,
		});

		res.send({ data: mapOrder(newOrder) });
	},
);

router.get(
	'/',
	authenticated,
	hasRole([ROLES.SALESMAN, ROLES.ADMIN]),
	async (req, res) => {
		const orders = await getOrders();

		res.send({ data: orders.map(mapOrder) });
	},
);

router.get('/:userId', authenticated, async (req, res) => {
	const { userId } = req.params;
	try {
		const orders = await getOrdersByUserId(userId);
		res.send({ data: orders.map(mapOrder) });
	} catch (error) {
		res.status(500).send(error);
	}
});

router.get('/login/:login', authenticated, async (req, res) => {
	const { login } = req.params;
	try {
		const orders = await getOrdersByUserLogin(login);
		res.send({ data: orders.map(mapOrder) });
	} catch (error) {
		res.status(500).send(error.message); // Лучше отправлять error.message для понимания ошибки.
	}
});

module.exports = router;
