const cron = require('node-cron');
const Notification = require('../models/notificationModel');

// Run job every day at midnight
cron.schedule('0 0 * * *', async () => {
  const oneDayAgo = new Date();
  oneDayAgo.setDate(oneDayAgo.getDate() - 1);
  
  await Notification.deleteMany({ createdAt: { $lt: oneDayAgo } });
  console.log('Old notifications cleaned');
});
