const express = require("express");
const router = new express.Router();
const authentication = require("../authentication/authentication");
const Supplier = require("../models/Supplier");

router.post("/api/suppliers", authentication, async (req, res) => {
  try {
    const supplier = new Supplier(req.body);
    await supplier.save();
    res.status(201).send();
  } catch (error) {
    res.status(400).send();
  }
});

router.get("/api/suppliers", authentication, async (req, res) => {
  try {
    const suppliers = await Supplier.find({});
    if (!suppliers.length) {
      return res.status(404).send();
    }
    res.status(200).send(suppliers);
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = router;
