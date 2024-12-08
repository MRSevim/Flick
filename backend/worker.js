const Bull = require("bull");
const emailQueue = new Bull("emailQueue");
const { sendEmail } = require("./helpers");

emailQueue.process(async (job) => {
  const { type, email, username, info } = job.data;

  try {
    await sendEmail(type, email, username, info);
    console.log(`Email sent to ${email} for type: ${type}`);
  } catch (error) {
    console.error(`Failed to send email to ${email}: ${error.message}`);
  }
});

module.exports = emailQueue;
