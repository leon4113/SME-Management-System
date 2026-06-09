//contains 1 or more items (product + quantity)
// automatically decrements product inventory when created
// pending by default (status)
// 
// validate all product exist and have enough stock
// create order + order items + decrement inventory in single transaction
// return created order with its items

const prisma = require('../../lib/prisma')
const { createAuditLog } = require('../audit/audit.service')

const createOrder = async (req, res) => {
  try {
    const { items } = req.body
    const userId = req.user.userId
    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } })
      if (!product) {
        return res.status(404).json({ error: 'Product not found' })
      }
      if (product.quantity < item.quantity) {
        return res.status(400).json({ error: `Product: ${product.name} out of stock` })
      }
    }

    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          status: 'PENDING',
          userId: userId
        }
      })
      for (const item of items) {
        const product = await tx.product.findUnique({ where: { id: item.productId } })
        
        await tx.orderItem.create({
          data: {
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: product.price,
            orderId: newOrder.id
          }
        })

        await tx.product.update({
          where: { id: item.productId },
          data: {quantity: {decrement: item.quantity}}
        })
      }
      return tx.order.findUnique({
        where: { id: newOrder.id },
        include: { items: true }
      })
    })
    await createAuditLog({ userId, action: 'CREATE_ORDER', entity: 'Order', entityId: order.id })
    
    res.status(201).json(order)
  }
  
  catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const getOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: { items: true}
    });
    
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  createOrder,
  getOrders
}