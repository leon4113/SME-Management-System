const prisma = require('../../lib/prisma')

const createAuditLog = async ({ userId, action, entity, entityId }) => {
  const auditLog = await prisma.auditLog.create({
    data: {
      userId,
      action,
      entity,
      entityId,
    },
  })
  return auditLog
}

module.exports = {
  createAuditLog,
}