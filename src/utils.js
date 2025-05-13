const updateProductPrice = (product) => {
  const newProduct = JSON.parse(JSON.stringify(product));
  let nhiaPrice = 0;
  const unitCostPrice = (newProduct.costPrice / newProduct.packSize).toFixed(2);
  const sellingPrice = (unitCostPrice * newProduct.markUp).toFixed(2);
  const nnpcPrice = (sellingPrice * 1.2).toFixed(2);
  const tenPercent = (0.1 * newProduct.fgPrice).toFixed(2);
  if (!newProduct?.nhiaCoverage) {
    newProduct.nhiaCoverage = "10%";
  }
  if (newProduct.nhiaCoverage === "10%") {
    if (newProduct.fgPrice === 0) {
      nhiaPrice = sellingPrice;
    } else if (sellingPrice > +newProduct.fgPrice) {
      const deficit = sellingPrice - newProduct.fgPrice;
      nhiaPrice = (deficit + +tenPercent).toFixed(2);
    } else {
      nhiaPrice = tenPercent;
    }
  } else {
    nhiaPrice = (0.5 * newProduct.sellingPrice).toFixed(2);
  }

  return {
    nhiaPrice,
    unitCostPrice,
    sellingPrice,
    nnpcPrice,
  };
};

module.exports = { updateProductPrice };
