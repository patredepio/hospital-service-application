const express = require("express");
const router = new express.Router();
const authentication = require("../authentication/authentication");
const {
  pharmaAuthentication,
} = require("../authentication/roleAuthentication");
const Product = require("../models/Product");
const Unit = require("../models/Unit");
const Location = require("../models/Location");
const { updateProductPrice } = require("../utils");
router.post(
  "/api/products/add-product",
  authentication,
  pharmaAuthentication,
  async (req, res) => {
    try {
      const { name, location, unit, clinic } = req.body;
      const validateProduct = await Product.find({
        name,
        location,
        unit,
        clinic,
      });
      if (validateProduct.length) {
        return res.status(400).send();
      }
      const product = new Product(req.body);
      await product.save();
      res.status(201).send(product);
    } catch (e) {
      res.status(400).send();
    }
  }
);
router.get("/api/products/search", authentication, async (req, res) => {
  const search = req.query;
  const keys = Object.keys(search);
  if (keys.length > 0) {
    keys.forEach((key) => {
      if (!search[key] || search[key] === "All") {
        delete search[key];
      }
    });
  }
  try {
    const products = await Product.find(search).populate(
      "productCategory unit"
    );

    if (!products.length) {
      return res.status(404).send();
    }
    res.status(200).send(products);
  } catch (e) {
    res.status(500).send();
  }
});
router.get("/api/products/:id", authentication, async (req, res) => {
  try {
    const _id = req.params.id;
    const product = await Product.findById(_id).populate("productCategory");
    if (!product) {
      return res.status(404).send();
    }
    res.status(200).send(product);
  } catch (e) {
    res.status(500).send();
  }
});
router.get("/api/other-products/:id", authentication, async (req, res) => {
  try {
    const id = req.params.id;
    const storeLocation = await Unit.findOne({ name: "STORE" });
    let products = null;
    if (req.query.store) {
      products = await Product.find({
        name: req.query.productName,
        _id: { $ne: id },
      })
        .populate("location")
        .populate("unit")
        .populate("clinic");
    } else {
      products = await Product.find({
        name: req.query.productName,
        _id: { $ne: id },
        unit: { $ne: storeLocation._id },
      })
        .populate("location")
        .populate("unit")
        .populate("clinic");
    }

    if (!products.length) {
      return res.status(404).send();
    }
    res.status(200).send(products);
  } catch (error) {
    res.status(500).send();
  }
});
//  My Version
// router.patch("/api/products/:id", authentication, async (req, res) => {
//   const updates = Object.keys(req.body);
//   const allowedUpdates = [
//     "name",
//     "productCategory",
//     "costPrice",
//     "quantity",
//     "fgPrice",
//     "packSize",
//     "minimumQuantity",
//     "expiryDate",
//     "markUp",
//   ];
//   const isValidOperation = updates.every((update) =>
//     allowedUpdates.includes(update)
//   );
//   if (!isValidOperation) {
//     return res.status(400).send();
//   }

//   try {
//     const _id = req.params.id;
//     const product = await Product.findById(_id).populate("unit");
//     if (!product) {
//       return res.status(404).send();
//     }
//     if (product.unit?.name === "STORE") {
//       updates.forEach(async (update) => {
//         if (update === "name" || update === "productCategory") {
//           // Update Many
//           const res = await Product.updateMany(
//             { name: product.name },
//             { [update]: req.body[update] }
//           );
//           if (!res.acknowledged) {
//             throw new Error("Unable to update Product");
//           }
//         } else if (
//           update === "costPrice" ||
//           update === "packSize" ||
//           update === "markUp"
//         ) {
//           const { nhiaPrice, sellingPrice, nnpcPrice, unitCostPrice } =
//             updateProductPrice(product, update, req.body[update]);

//           const res = await Product.updateMany({ name: product.name }, [
//             {
//               $set: {
//                 [update]: req.body[update],
//                 nhiaPrice,
//                 sellingPrice,
//                 nnpcPrice,
//                 unitCostPrice,
//               },
//             },
//           ]);
//           if (!res.acknowledged) {
//             throw new Error("Unable to update Product");
//           }
//         } else {
//           product[update] = req.body[update];
//         }
//       });
//       await product.save();
//     } else {
//       updates.forEach(async (update) => {
//         if (
//           update === "name" ||
//           update === "productCategory" ||
//           update === "markUp"
//         ) {
//           return res.status(403).send({ error: "Not Allowed" });
//         } else {
//           product[update] = req.body[update];
//         }
//       });
//       await product.save();
//     }
//     res.status(200).send(product);
//   } catch (e) {
//     res.status(400).send();
//   }
// });
// AI Version
router.patch("/api/products/:id", authentication, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "name",
    "productCategory",
    "costPrice",
    "quantity",
    "fgPrice",
    "packSize",
    "minimumQuantity",
    "expiryDate",
    "markUp",
    "nhiaCoverage",
  ];
  const restrictedUpdates = ["name", "productCategory"];
  4;
  const priceRelatedUpdates = [
    "costPrice",
    "packSize",
    "markUp",
    "fgPrice",
    "nhiaCoverage",
  ];
  const otherUpdates = ["quantity", "expiryDate", "minimumQuantity"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(400).send();
  }

  try {
    const _id = req.params.id;
    const product = await Product.findById(_id).populate("unit");
    if (!product) {
      return res.status(404).send();
    }

    // For non-STORE units, disallow updates to specific fields.
    if (product.unit?.name !== "STORE") {
      // check if the updates contains  other updates apart from otherUpdates, if it does return 403
      const hasRestrictedUpdates = updates.some(
        (update) => !otherUpdates.includes(update)
      );
      if (hasRestrictedUpdates) {
        return res.status(403).send({ error: "Not Allowed" });
      }
      // Apply only allowed updates
      updates.forEach((update) => {
        product[update] = req.body[update];
      });
      await product.save();
      res.status(200).send(product);
    }

    if (product.unit?.name === "STORE") {
      const productIds = await Product.distinct("_id", {
        name: product.name,
      });
      // check the updates for restricted updates present in it
      const restrictedBodyUpdates = updates.filter((update) =>
        restrictedUpdates.includes(update)
      );
      if (restrictedBodyUpdates.length > 0) {
        const restrictedBody = restrictedBodyUpdates.reduce((acc, update) => {
          acc[update] = req.body[update];
          return acc;
        }, {});

        const result = await Product.updateMany(
          { _id: { $in: productIds } }, // filter: any _id in your array
          { $set: restrictedBody } // update: set status field
        );
        if (!result.acknowledged) {
          throw new Error("Unable to update Product");
        }
      }
      const priceRelatedBodyUpdates = updates.filter((update) =>
        priceRelatedUpdates.includes(update)
      );
      if (priceRelatedBodyUpdates.length > 0) {
        console.log(priceRelatedBodyUpdates);
        const newProduct = JSON.parse(JSON.stringify(product));
        // update the product with the new price related body
        const priceRelatedBody = {};
        priceRelatedBodyUpdates.forEach((update) => {
          newProduct[update] = req.body[update];
          priceRelatedBody[update] = req.body[update];
        });
        const { nhiaPrice, sellingPrice, nnpcPrice, unitCostPrice } =
          updateProductPrice(newProduct);
        const result = await Product.updateMany(
          { _id: { $in: productIds } }, // filter: any _id in your array
          {
            $set: {
              ...priceRelatedBody,
              unitCostPrice,
              nhiaPrice,
              sellingPrice,
              nnpcPrice,
            },
          }
        );
        if (!result.acknowledged) {
          throw new Error("Unable to update Product");
        }
      }
      const otherBodyUpdates = updates.filter((update) =>
        otherUpdates.includes(update)
      );
      if (otherBodyUpdates.length > 0) {
        otherBodyUpdates.forEach(
          (update) => (product[update] = req.body[update])
        );
        await product.save();
      }
    }
    res.status(200).send(product);
  } catch (e) {
    // Optionally, log the error: console.error(e);
    res.status(400).send();
  }
});

router.patch("/api/product/quantity/:id", authentication, async (req, res) => {
  const update = req.body;
  if (!update.quantity) {
    return res.status(400).send("Updating an element that is not available");
  }
  try {
    const id = req.params.id;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).send();
    }
    product.quantity -= +update.quantity;
    await product.save();
    res.status(200).send(product);
  } catch (e) {
    res.status(400).send();
  }
});
router.patch("/api/product/expiries/:id", authentication, async (req, res) => {
  try {
    const expiries = req.body;
    if (!expiries) {
      return res.status(400).send();
    }
    const id = req.params.id;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).send();
    }
    product.expiries = [expiries, ...product.expiries];
    await product.save();
    res.status(200).send();
  } catch (error) {
    res.status(400).send();
  }
});
router.get("/api/product/expiries", authentication, async (req, res) => {
  try {
    const products = await Product.find({
      "expiries.expiryDate": {
        $gte: new Date(req.query.startDate),
        $lt: new Date(req.query.endDate),
      },
      ...req.query,
    });
    if (!products.length) {
      return res.status(404).send();
    }
    res.status(200).send(products);
  } catch (error) {
    res.status(500).send();
  }
});
router.patch(
  "/api/product/add-quantity/:id",
  authentication,
  async (req, res) => {
    const update = req.body;
    if (!update.quantity) {
      return res.status(400).send("Updating an element that is not available");
    }
    try {
      const _id = req.params.id;
      const product = await Product.findById(_id);
      if (!product) {
        return res.status(404).send();
      }
      product.quantity += +update.quantity;
      await product.save();
      res.status(200).send(product);
    } catch (e) {
      res.status(400).send();
    }
  }
);
router.get("/api/fetch-products", authentication, async (req, res) => {
  try {
    const storeLocation = await Unit.findOne({ name: "STORE" });
    const $location = await Location.findOne({ name: "USELU" });
    const clinic = await Unit.findOne({ name: "PSYCHIATRY" });
    const products = await Product.find({
      name: { $regex: req.query.search, $options: "i" },
      unit: storeLocation._id,
      location: $location._id,
      clinic: clinic._id,
    })
      .limit(5)
      .sort({ createdAt: -1 })
      .populate("productCategory");
    if (!products.length) {
      return res.status(404).send();
    }
    res.status(200).send(products);
  } catch (error) {
    res.status(500).send();
  }
});
router.get("/api/product/get-expiries", authentication, async (req, res) => {
  if (req.query.type === "potentialExpiries") {
    try {
      const { date: mainDate, location, unit, clinic } = req.query;

      const date = new Date(mainDate);
      const expiries = await Product.find({
        location,
        unit,
        clinic,
        expiryDate: { $lte: date },
        quantity: { $gt: 0 },
      }).populate("productCategory");
      if (!expiries.length) {
        return res.status(404).send();
      }
      res.status(200).send(expiries);
    } catch (error) {
      res.status(500).send();
    }
  } else if (req.query.type === "expired") {
    try {
      const { date: mainDate, location, unit, clinic } = req.query;

      const date = new Date(mainDate);

      const expiries = await Product.find({
        location,
        unit,
        clinic,
        expiryDate: { $lt: date },
        quantity: { $gt: 0 },
      }).populate("productCategory");

      if (!expiries.length) {
        return res.status(404).send();
      }
      res.status(200).send(expiries);
    } catch (error) {
      res.status(500).send();
    }
  }
});
router.delete(
  "/api/products/:id",
  authentication,
  pharmaAuthentication,
  async (req, res) => {
    try {
      const _id = req.params.id;
      const product = await Product.findById(_id).populate("unit location");
      if (!product) {
        return res.status(404).send();
      }
      if (product.unit.name === "STORE" && product.location.name === "USELU") {
        await Product.deleteMany({ name: product.name });
        res.status(200).send();
      } else {
        await Product.deleteOne({ _id });
        res.status(200).send();
      }
    } catch (e) {
      res.status(500).send();
    }
  }
);

module.exports = router;
