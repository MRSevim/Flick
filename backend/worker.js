/* const Bull = require("bull");
const emailQueue = new Bull("emailQueue", envVariables.redisUri); */
const { Queue, Worker } = require("bullmq");

const envVariables = require("./envVariables");
const connection = {
  connection: { url: envVariables.redisUri },
};
const { sendEmail } = require("./helpers");
// Create a queue
const emailQueue = new Queue("emailQueue", connection);

// Create a worker to process jobs
const emailWorker = new Worker(
  "emailQueue",
  async (job) => {
    const { type, email, username, info } = job.data;

    try {
      await sendEmail(type, email, username, info);
      console.log(`Email sent to ${email} for type: ${type}`);
    } catch (error) {
      console.error(`Failed to send email to ${email}: ${error.message}`);
    }
  },
  connection
);

emailWorker.on("failed", (job, err) => {
  console.error(`Job ${job.id} failed: ${err.message}`);
});
/* emailQueue.process(async (job) => {
  const { type, email, username, info } = job.data;

  try {
    await sendEmail(type, email, username, info);
    console.log(`Email sent to ${email} for type: ${type}`);
  } catch (error) {
    console.error(`Failed to send email to ${email}: ${error.message}`);
  }
}); */

module.exports = emailQueue;
