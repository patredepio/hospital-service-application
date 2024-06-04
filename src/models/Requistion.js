const mongoose = require("mongoose");
const requistionSchema = new mongoose.Schema(
  {
    unit: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Unit",
    },
    location: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Location",
    },
    clinic: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Unit",
    },
    siv: {
      type: Number,
    },
    requistingPharmacist: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    numberOfProducts: {
      type: Number,
      required: true,
    },
    costOfRequistion: {
      type: Number,
      required: true,
    },
    products: [],
    requistionProcess: {
      type: Boolean,
      required: true,
      default: true,
    },
    issuance: {
      type: Boolean,
      default: false,
      required: true,
    },
    reception: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Requistion = mongoose.model("Requistion", requistionSchema);
module.exports = Requistion;
