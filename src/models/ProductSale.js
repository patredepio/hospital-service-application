const mongoose = require("mongoose");
const Receipt = require("./Receipt");
const productSalesSchema = new mongoose.Schema(
  {
    receipt: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Receipt",
    },
    assessment: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
    },
    ward: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ward",
    },
    pricing: {
      type: String,
      required: true,
      uppercase: true,
    },
    location: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
    },
    unit: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: "Unit",
    },
    clinic: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Unit",
    },
    serviceClinic: {
      type: String,
      required: true,
    },
    patientType: {
      type: String,
      required: true,
    },
    collector: {
      type: String,
      uppercase: true,
      trim: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    products: [],
  },
  {
    timestamps: true,
  }
);
productSalesSchema.pre("remove", async function (next) {
  const sale = this;
  if (sale.receipt) {
    await Receipt.deleteMany({ _id: sale.receipt._id });
  }

  next();
});
const ProductSale = mongoose.model("ProductSale", productSalesSchema);

module.exports = ProductSale;
