const express = require("express");
const Notification = require("../models/Notification");
const router = new express.Router();
const authentication = require("../authentication/authentication");
const User = require("../models/User");

// router.post("/api/notification", authentication, async (req, res) => {
//   try {
//     const notification = new Notification({
//       message: req.body.id,
//     });
//     await notification.save();
//     await notification.populate("message");
//     const sentNotification = await User.populate(notification, {
//       path: "sender",
//       select: "firstName lastName",
//     });
//     const finalNotification = await User.populate(sentNotification, {
//       path: "chat",
//       select: "name",
//     });
//     res.status(201).send(finalNotification);
//   } catch (error) {
//     res.status(400).send();
//   }
// });
router.post("/api/notification", authentication, async (req, res) => {
  try {
    const notification = new Notification({ ...req.body });
    await notification.save();
    res.status(201).send();
  } catch (error) {
    res.status(400).send();
  }
});

router.patch("/api/notification/:id", authentication, async (req, res) => {
  try {
    const notification = Notification.findById(req.params.id);
    if (!notification) {
      return res.status(401).send();
    }
    notification.read = true;
  } catch (error) {
    res.status(400).send();
  }
});

router.get("/api/notification", authentication, async (req, res) => {
  try {
    const notifications = Notification.find({ read: false });
    if (!notifications) {
      return res.status(401).send();
    }
    res.status(200).send();
  } catch (error) {
    res.status(400).send();
  }
});
module.exports = router;
