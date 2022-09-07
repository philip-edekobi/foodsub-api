const { Router: router } = require('express');
const {createOrder, getOrder, getOrders, updateOrder, deleteOrder} = require('../controllers/orderControllers')

router.route('/').get(getOrders).post(createOrder)
router.route('/:id').get(getOrder).patch(updateOrder).delete(deleteOrder)


module.exports = router