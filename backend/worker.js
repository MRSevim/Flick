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
    } catch (error) {
      console.error(`${error.message}`);
    }
  },
  connection
);

emailWorker.on("failed", (job, err) => {
  console.error(`Job ${job.id} failed: ${err.message}`);
});

module.exports = emailQueue;
