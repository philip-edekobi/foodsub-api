const { Router} = require('express');
const {createSubscription, getSubscription, getSubscriptions, updateSubscription, deleteSubscription} = require('../controllers/subscriptionControllers')

const router = Router()

router.route('/').get(getSubscriptions).post(createSubscription)
router.route('/:id').get(getSubscription).patch(updateSubscription).delete(deleteSubscription)


module.exports = router