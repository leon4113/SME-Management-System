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

const getAuditLogs = async () => {
  const auditLogs = await prisma.auditLog.findMany(
    {
      include: {user: {select: {email: true }}}
    }
  )
  return auditLogs
}

module.exports = {
  createAuditLog,
  getAuditLogs,
}