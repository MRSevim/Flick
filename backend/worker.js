const Bull = require("bull");
const envVariables = require("./envVariables");
const emailQueue = new Bull("emailQueue", {
  redis: { port: 6379, host: "redis" },
});
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
