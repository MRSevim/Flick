const { User } = require("../models/userModel");
const sanitizeHtml = require("sanitize-html");
const crypto = require("crypto");

// Encryption function
function encryptText(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(process.env.ENCRYPTION_KEY),
    iv
  );
  let encrypted = cipher.update(text, "utf-8", "hex");

  encrypted += cipher.final("hex");
  const encryptedHex = iv.toString("hex") + ":" + encrypted.toString("hex");

  return encryptedHex;
}

// Decryption function
function decryptText(encryptedText) {
  const encryptedArray = encryptedText.split(":");
  const iv = Buffer.from(encryptedArray[0], "hex");
  const encrypted = encryptedArray[1];
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(process.env.ENCRYPTION_KEY),
    iv
  );
  let decrypted = decipher.update(encrypted, "hex", "utf-8");
  decrypted += decipher.final("utf-8");
  return decrypted;
}

// send a pm
const sendPm = async (req, res, next) => {
  try {
    const targetUser = await User.findOne({ _id: req.params.id });
    const user = await User.findById(req.user._id);

    if (!targetUser) {
      res.status(404);
      throw new Error("Target user is not found");
    }
    if (!user) {
      res.status(404);
      throw new Error("User is not found");
    }
    if (user._id.equals(targetUser._id)) {
      res.status(400);
      throw new Error("You cannot send a message to yourself");
    }

    if (targetUser.newPmsDisabled) {
      res.status(400);
      throw new Error("You cannot send a message to this user");
    }

    const { subject, message } = req.body;

    if (!subject || !message) {
      res.status(400);
      throw new Error("Title and content can't be empty");
    }
    const sanitizedSubject = sanitizeHtml(subject);
    const sanitizedMessage = sanitizeHtml(message);
    if (!sanitizedSubject || !sanitizedMessage) {
      res.status(400);
      throw new Error("Sanitized inputs can't be empty");
    }

    const encryptedSubject = encryptText(sanitizedSubject);
    const encryptedMessage = encryptText(sanitizedMessage);

    const createMessage = (key) => {
      return {
        [key]: {
          _id: key === "to" ? targetUser._id : user._id,
          username: key === "to" ? targetUser.username : user.username,
        },
        subject: encryptedSubject,
        message: encryptedMessage,
      };
    };

    targetUser.messages.received.push(createMessage("from"));
    user.messages.sent.push(createMessage("to"));

    await Promise.all([targetUser.save(), user.save()]);

    // Retrieve the newly created message _id
    const savedMessage = user.messages.sent[user.messages.sent.length - 1];

    res.status(201).json({
      message: "Message is successfully sent",
      pm: {
        _id: savedMessage._id,
        to: savedMessage.to,
        subject: sanitizedSubject,
        message: sanitizedMessage,
      },
    });
  } catch (error) {
    next(error);
  }
};
//get received unread messages length
const getReceivedLength = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const receivedTotal = user.messages.received;
    const receivedUnreadLength = receivedTotal.filter(
      (message) => message.read === false
    ).length;

    res.status(200).json({
      receivedUnreadLength,
      receivedTotalLength: receivedTotal.length,
    });
  } catch (error) {
    next(error);
  }
};
// get pms
const getPms = async (req, res, next) => {
  const { page, type } = req.query;
  try {
    if (!page) {
      res.status(400);
      throw new Error("Please send a page number");
    }
    if (!type || !["received", "sent"].includes(type)) {
      res.status(400);
      throw new Error("Please send a type (received or sent)");
    }
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const messages = user.messages[type];
    const LIMIT = 10;
    const startIndex = (Number(page) - 1) * LIMIT;

    const paginatedMessages = messages
      .slice(startIndex, startIndex + LIMIT)
      .map((message) => {
        return {
          ...message.toObject(),
          subject: decryptText(message.subject),
          message: decryptText(message.message),
        };
      });

    res.status(200).json({
      messages: paginatedMessages.reverse(),
      currentPage: Number(page),
      totalPages: Math.ceil(messages.length / LIMIT),
    });
  } catch (error) {
    next(error);
  }
};

// delete pm
const deletePm = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const messageId = req.params.id;

    if (!user) {
      res.status(404);
      throw new Error("User is not found");
    }

    const findInArray = (array) => {
      return array.find((message) => {
        return message._id.equals(messageId);
      });
    };

    const foundInSent = findInArray(user.messages.sent);
    const foundInReceived = findInArray(user.messages.received);
    if (!foundInSent && !foundInReceived) {
      res.status(404);
      throw new Error("Message is not found");
    }
    await User.findByIdAndUpdate(user._id, {
      $pull: {
        "messages.sent": { _id: messageId },
        "messages.received": { _id: messageId },
      },
    });

    res.status(201).json({
      message: "Message with id of " + req.params.id + " was deleted",
    });
  } catch (error) {
    next(error);
  }
};
// delete many pms
const deleteMany = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const { ids } = req.body;

    if (!user) {
      res.status(404);
      throw new Error("User is not found");
    }

    if (!ids) {
      res.status(400);
      throw new Error("Please send array of ids");
    }
    if (ids.length === 0) {
      res.status(400);
      throw new Error("Please select at least 1 message to delete");
    }

    // Check if all messages to be deleted belong to the user
    const allMessagesBelongToUser = ids.every((id) => {
      return (
        user.messages.sent.some((sentMessage) => sentMessage._id.equals(id)) ||
        user.messages.received.some((receivedMessage) =>
          receivedMessage._id.equals(id)
        )
      );
    });

    if (!allMessagesBelongToUser) {
      res.status(404);
      throw new Error("Some of the messages do not exist");
    }
    // Remove messages from user's sent and received arrays
    await User.findByIdAndUpdate(user._id, {
      $pull: {
        "messages.sent": { _id: { $in: ids } },
        "messages.received": { _id: { $in: ids } },
      },
    });

    res.status(200).json({ message: "Messages are successfully deleted" });
  } catch (error) {
    next(error);
  }
};
//mark as read
const markAsRead = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404);
      throw new Error("User is not found");
    }

    user.messages.received.forEach((message) => {
      message.read = true;
    });
    await user.save();

    res.status(200).json({ message: "Received messaged are marked as read" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendPm,
  getPms,
  deletePm,
  deleteMany,
  markAsRead,
  getReceivedLength,
};
