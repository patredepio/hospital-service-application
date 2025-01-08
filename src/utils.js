const updateProductPrice = (product, updateType, value) => {
  const newProduct = JSON.parse(JSON.stringify(product));
  let nhiaPrice = 0;
  newProduct[updateType] = value;
  const unitCostPrice = (newProduct.costPrice / newProduct.packSize).toFixed(2);
  const sellingPrice = (unitCostPrice * newProduct.markUp).toFixed(2);
  const nnpcPrice = (sellingPrice * 1.2).toFixed(2);
  const tenPercent = (0.1 * newProduct.fgPrice).toFixed(2);
  if (newProduct.fgPrice === 0) {
    nhiaPrice = sellingPrice;
  } else if (sellingPrice > +newProduct.fgPrice) {
    const deficit = sellingPrice - newProduct.fgPrice;
    nhiaPrice = (deficit + +tenPercent).toFixed(2);
  } else {
    nhiaPrice = tenPercent;
  }

  return {
    nhiaPrice,
    unitCostPrice,
    sellingPrice,
    nnpcPrice,
  };
};

module.exports = { updateProductPrice };
