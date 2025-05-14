const updateProductPrice = (product) => {
  const newProduct = JSON.parse(JSON.stringify(product));
  let nhiaPrice = 0;
  const unitCostPrice = (newProduct.costPrice / newProduct.packSize).toFixed(2);
  const sellingPrice = (unitCostPrice * newProduct.markUp).toFixed(2);
  const nnpcPrice = (sellingPrice * 1.2).toFixed(2);
  const tenPercent = (0.1 * newProduct.fgPrice).toFixed(2);
  const fiftyPercent = (0.5 * newProduct.fgPrice).toFixed(2);

  if (!newProduct?.nhiaCoverage) {
    newProduct.nhiaCoverage = "10%";
  }
  const percent = newProduct.nhiaCoverage === "50%" ? fiftyPercent : tenPercent;

  if (newProduct.fgPrice === 0) {
    nhiaPrice = sellingPrice;
  } else if (sellingPrice > +newProduct.fgPrice) {
    const deficit = sellingPrice - newProduct.fgPrice;
    nhiaPrice = (deficit + +percent).toFixed(2);
  } else {
    nhiaPrice = +percent;
  }

  return {
    nhiaPrice,
    unitCostPrice,
    sellingPrice,
    nnpcPrice,
  };
};

module.exports = { updateProductPrice };
