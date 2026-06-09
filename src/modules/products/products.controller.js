const prisma = require('../../lib/prisma');
const { createAuditLog } = require('../audit/audit.service');


const createProduct = async (req, res) => {
  try {
    const { name, sku, price, quantity } = req.body;
    const product = await prisma.product.create({
      data: {
        name,
        sku,
        price,
        quantity,
      },
    });
    
    await createAuditLog({ userId: req.user.userId, action: 'CREATE_PRODUCT', entity: 'Product', entityId: product.id });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const {name, price, quantity } = req.body;
    const {id} = req.params;
    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        price,
        quantity,
      },
    });
    await createAuditLog({ userId: req.user.userId, action: 'UPDATE_PRODUCT', entity: 'Product', entityId: product.id });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProducts = async (req, res) => {
  try {
    const product = await prisma.product.findMany()
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createProduct,
  updateProduct,
  getProducts
};