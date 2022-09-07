const createOrder = async (req, res) => {
    res.send('create')
}

const getOrders = async (req, res) => {
    res.send('gets')
}

const getOrder = async (req, res) => {
    res.send('get')
}

const updateOrder = async (req, res) => {
    res.send('update')
}

const deleteOrder = async (req, res) => {
    res.send('delete')
}


module.exports = {createOrder, getOrder, getOrders, updateOrder, deleteOrder}