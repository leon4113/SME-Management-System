const { getAuditLogs } = require('./audit.service');

const getAuditLogsController = async (req, res) => {
  try {
    const logs = await getAuditLogs();
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getAuditLogsController };