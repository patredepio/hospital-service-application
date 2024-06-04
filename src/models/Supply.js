const mongoose = require("mongoose");

const supplySchema = new mongoose.Schema(
  {
    srv: {
      type: String,
    },
    pharmacist: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Supplier",
    },
    location: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Location",
    },
    unit: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Unit",
    },
    clinic: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Unit",
    },
    exchange: {
      type: Boolean,
      default: false,
    },

    products: [],
  },
  {
    timestamps: true,
  }
);

const Supply = mongoose.model("Supply", supplySchema);

module.exports = Supply;
