import { getDate } from "../general/general";
export const getFormTimeDate = (expiryDate) => {
  const parsedDate = Date.parse(`${expiryDate}`);
  const date = Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "2-digit",
  })
    .format(parsedDate)
    .replace("/", "-");
  const newDate = [date.split("-")[1], date.split("-")[0]].join("-");
  return newDate;
};
export const intializedProductState = (productDatabase) => {
  const stockTakingProducts = productDatabase.map((product) => {
    const newObject = {};
    newObject.name = product.name;
    newObject.quantity = product.quantity;
    newObject.physicalQuantity = product.quantity;
    newObject.costPrice = product.costPrice;
    newObject.unitCostPrice = product.unitCostPrice;
    newObject.expQty = 0;
    newObject.unit = product.unit;
    newObject.expiryDate = getFormTimeDate(product.expiryDate);
    newObject._id = product._id;
    return newObject;
  });
  return stockTakingProducts;
};
export const setProductStateHandler = (
  productDatabase,
  setProductState,
  setIsLoading
) => {
  setIsLoading(true);
  const stockTakingProducts = intializedProductState(productDatabase);

  const newStockTakingProducts = JSON.parse(
    JSON.stringify(stockTakingProducts)
  );
  setProductState(newStockTakingProducts);
  setIsLoading(false);
};

export const updateStockTakingProducts = (e, i, setProductState) => {
  const { name, value } = e.target;

  setProductState((prevState) => {
    const newState = JSON.parse(JSON.stringify(prevState));
    const productItemState = newState[i];
    productItemState[name] = value;
    newState.splice(i, 1, productItemState);
    return [...newState];
  });
};

export const clearStock = (productDatabase, setProductState) => {
  const stockTakingProducts = intializedProductState(productDatabase);
  setProductState(stockTakingProducts);
};

// export const renderInventoryReport = (inventoryData, logoImage) => {
//   const doc = new jsPDF();
//   const startX = 15;
//   const startY = 55;
//   const pageHeight = 280;
//   let currentY = startY;

//   // Fallback date formatter if dateTimeFormat is not defined
//   const formatDateTime = (date) => date.toLocaleString();

//   const addHeader = (isFirstPage) => {
//     doc.setFontSize(12);
//     doc.text("FEDERAL NEURO-PSYCHIATRIC HOSPITAL", 71, 22.5);
//     if (isFirstPage) {
//       doc.addImage(logoImage, "PNG", 46, 15, 20, 20);
//     }
//     doc.setFontSize(10);
//     doc.text("P.M.B  1108 BENIN CITY", 71, 26.5);
//     doc.setFontSize(8);
//     doc.text("www.fnphbenin.gov.ng  info@fnphbenin.gov.ng", 71, 29.5);
//     doc.text("+2348032231189 +23481511300304", 71, 32.5);
//     doc.setFontSize(8);
//     doc.text("INVENTORY REPORT", 10, 45, { fontStyle: "bold" });
//     doc.text(`${formatDateTime(new Date())}`, 180, 10);
//   };

//   const addTableHeader = () => {
//     doc.setFontSize(7);
//     // Set font style to bold
//     doc.setFont(undefined, "bold");
//     doc.text("S/N", startX, currentY);
//     doc.text("Product Name", startX + 20, currentY);
//     doc.text("Quantity", startX + 60, currentY);
//     doc.text("Cost Price", startX + 90, currentY);
//     doc.text("Unit Cost Price", startX + 120, currentY);
//     doc.text("Expiry Date", startX + 150, currentY);
//     doc.text("Amount", startX + 180, currentY);
//     doc.text("Expired Quantity", startX + 210, currentY);
//     // Reset font style to normal
//     doc.setFont(undefined, "normal");
//     currentY += 7;
//   };

//   addHeader(true);
//   addTableHeader();

//   inventoryData.forEach((product, index) => {
//     if (currentY > pageHeight) {
//       doc.addPage();
//       currentY = 20;
//       addHeader(false);
//       addTableHeader();
//     }
//     doc.text(`${index + 1}`, startX, currentY);
//     doc.text(product.name || "", startX + 20, currentY);
//     doc.text(`${product.quantity || ""}`, startX + 60, currentY);
//     doc.text(`${product.costPrice || ""}`, startX + 90, currentY);
//     doc.text(`${product.unitCostPrice || ""}`, startX + 120, currentY);
//     doc.text(product.expiryDate || "", startX + 150, currentY);
//     doc.text(`${product.amount || ""}`, startX + 180, currentY);
//     doc.text(`${product.expiredQuantity || ""}`, startX + 210, currentY);
//     currentY += 7;
//   });

//   doc.save("inventoryReport.pdf");
// };
