const bcrypt = require('bcrypt');
const prisma = require('../../lib/prisma');
const { createAuditLog } = require('../audit/audit.service');


const createUser = async (req, res) => {
  try {
    const {email, password, role} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        role,
      },
    });

    const { passwordHash, ...userWithoutPassword } = user;

    await createAuditLog({ userId: req.user.userId, action: 'CREATE_USER', entity: 'User', entityId: user.id });

    res.status(201).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true
      },
    });
    
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { createUser, getUsers };