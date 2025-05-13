import { addTransferRequest } from "../../../../Utility/inventory/transferProducts";
import {
  editProductById,
  getProductById,
  updateProductQuantity,
  addExpiriesRequest,
} from "../../../../Utility/product/product";
import { addProductLogs } from "../../../../Utility/inventory/addProduct";
import {
  resetProductMessenger,
  sendProductMessenger,
} from "./addProductAction";
import { initProductDatabase } from "../general/generalAction";
import { clearAuthentication } from "../auth/loginAction";
import { addNotificationRequest } from "../../../../Utility/users/usersChat";
import { getFormTimeDate } from "../../../../Utility/inventory/stockTakingProduct";

export const validateTransfer = (state, setState) => {
  return (dispatch) => {
    const products = [...state.productList];
    const isQtyValid = products.every(
      (product) => +product.get("quantity") > 0
    );
    const isQtyAvailable = products.every(
      (product) => +product.get("onHandQuantity") >= +product.get("quantity")
    );

    if (!products.length) {
      dispatch(sendProductMessenger("No products in the transfer List", true));
      setTimeout(() => {
        dispatch(resetProductMessenger());
      }, 3000);
      return;
    }
    if (isQtyAvailable && isQtyValid) {
      setState((prevState) => {
        return {
          ...prevState,
          preview: true,
        };
      });
    } else {
      if (!isQtyValid) {
        dispatch(sendProductMessenger("A Quantity is not valid", true));
      } else {
        dispatch(
          sendProductMessenger(
            "The Quantity Approved is greater than the present quantity",
            true
          )
        );
      }
      setTimeout(() => {
        dispatch(resetProductMessenger());
      }, 3000);
    }
  };
};

const validateSubmission = (form) => {
  const mainLocation = JSON.parse(sessionStorage.getItem("location"))?.name;
  const mainUnit = JSON.parse(sessionStorage.getItem("unit"))?.name;
  const mainClinic = JSON.parse(sessionStorage.getItem("clinic"))?.name;
  return (dispatch) => {
    if (
      form.location === mainLocation &&
      form.unit === mainUnit &&
      form.clinic === mainClinic
    ) {
      dispatch(sendProductMessenger("Please change location", true));
      setTimeout(() => {
        dispatch(resetProductMessenger());
      }, 3000);
      return false;
    } else {
      return true;
    }
  };
};
export const submitTransfer = (
  e,
  state,
  setState,
  token,
  location,
  unit,
  clinic,
  setTransferComponent,
  socket
) => {
  e.preventDefault();
  return async (dispatch) => {
    const form = Object.fromEntries(new FormData(e.target).entries());
    if (dispatch(validateSubmission(form))) {
      const finalClinic = state.clinics.find(
        (clinic) => clinic.name === form.clinic
      )._id;
      const finalLocation = state.locations.find(
        (loc) => loc.name === form.location
      )._id;
      const finalUnit = state.units.find((unit) => unit.name === form.unit)._id;
      const products = [...state.productList].map((product) =>
        Object.fromEntries(product)
      );
      const newForm = {
        products,
        location,
        unit,
        clinic,
        finalUnit,
        finalLocation,
        finalClinic,
      };
      setState((prevState) => {
        return {
          ...prevState,
          loading: true,
        };
      });

      try {
        const addTransferResponse = await addTransferRequest(
          token,
          JSON.stringify(newForm)
        );
        if (addTransferResponse?.ok) {
          products.forEach(async (product) => {
            try {
              const productResponse = await updateProductQuantity(
                token,
                product.id,
                JSON.stringify({ quantity: +product.quantity })
              );
              if (productResponse?.ok) {
                const destClinic = state.clinics.find(
                  (clinic) => clinic.name === form.clinic
                ).name;
                const destLocation = state.locations.find(
                  (loc) => loc.name === form.location
                ).name;
                const destUnit = state.units.find(
                  (unit) => unit.name === form.unit
                ).name;
                const newProduct = await productResponse.json();
                const movement = new Map();
                movement.set(
                  "movement",
                  `TRANSFER TO ${destLocation}, ${destClinic} ${destUnit} `
                );
                movement.set("issued", product.quantity);
                movement.set("balance", newProduct.quantity);
                movement.set("product", product.id);
                movement.set("unit", unit);
                movement.set("location", location);
                movement.set("clinic", clinic);
                // add logs
                const movementResponse = await addProductLogs(
                  token,
                  JSON.stringify(Object.fromEntries(movement))
                );
                if (movementResponse?.ok) {
                  movement.clear();
                  dispatch(initProductDatabase(token, location, unit, clinic));
                } else {
                  throw {
                    message: movementResponse.statusText,
                    status: movementResponse.status,
                  };
                }
              } else {
                throw {
                  message: productResponse.statusText,
                  status: productResponse.status,
                };
              }
            } catch (error) {
              if (error.status === 401) {
                dispatch(clearAuthentication(error.status));
              } else {
                dispatch(
                  sendProductMessenger("problem transferring products", true)
                );
                setState((prevState) => {
                  return {
                    ...prevState,
                    loading: false,
                  };
                });
                setTimeout(() => {
                  dispatch(resetProductMessenger());
                }, 3000);
                return;
              }
            }
          });
          const unitName = JSON.parse(sessionStorage.getItem("unit"))?.name;
          const clinicName = JSON.parse(sessionStorage.getItem("clinic"))?.name;
          const locationName = JSON.parse(
            sessionStorage.getItem("location")
          )?.name;
          const notificationResponse = await addNotificationRequest(
            token,
            JSON.stringify({
              type: "transfer",
              message: `Transfer was sent from ${locationName}, ${clinicName}, ${unitName}`,
              clinic: finalClinic,
              unit: finalUnit,
              location: finalLocation,
            })
          );
          if (notificationResponse?.ok) {
            setTransferComponent((prevState) => {
              return {
                ...prevState,
                transferComponent: false,
              };
            });
            setState((prevState) => {
              return {
                ...prevState,
                loading: false,
                preview: false,
                productList: [],
              };
            });
            const notification = await notificationResponse.json();

            socket.emit("requistion", {
              type: "transfer",
              locationName: form.location,
              unit: form.unit,
              clinic: form.clinic,
              message: `Transfer was sent from ${locationName}, ${clinicName}, ${unitName}`,
            });
            socket.emit("notification", notification);
            dispatch(sendProductMessenger("products transferred successfully"));
            setTimeout(() => {
              dispatch(resetProductMessenger());
            }, 3000);
          }
        } else {
          throw {
            message: addTransferResponse.statusText,
            status: addTransferResponse.status,
          };
        }
      } catch (error) {
        if (error.status === 401) {
          dispatch(clearAuthentication(error.status));
        } else {
          dispatch(sendProductMessenger("problem transferring products", true));
          setState((prevState) => {
            return {
              ...prevState,
              loading: false,
            };
          });
          setTimeout(() => {
            dispatch(resetProductMessenger());
          }, 3000);
          return;
        }
      }
    }
  };
};

//  FOR STOCK TAKING MY CODE
// const compareStockQuantities = (products, database) => {
//   products
//     .map((product) => {
//       const presentProduct = database.find((dataP) => dataP._id === product.id);
//       if (!presentProduct) return null; // Skip if product not found in the database

//       const requestObj = {};

//       // PHYSICAL QUANTITY: update only if it exists and values differ
//       if (
//         presentProduct.quantity &&
//         product.physicalQuantity !== presentProduct.quantity
//       ) {
//         requestObj.quantity = product.physicalQuantity;
//       }

//       // EXP QTY: update only if product.expQty is exactly 0
//       if (product.expQty !== 0) {
//         requestObj.expQty = product.expQty;
//       }

//       // EXP DATE: update if the formatted expiry date doesn't match
//       if (product.expiryDate !== getFormTimeDate(presentProduct.expiryDate)) {
//         requestObj.expiryDate = product.expiryDate;
//       }

//       // Return updated object if there are changes
//       return Object.keys(requestObj).length > 0
//         ? { ...requestObj, id: presentProduct._id }
//         : null;
//     })
//     .filter((item) => item !== null);
// };

// // const compareStockQuantities = (products, database) => {
// // products.map((product) => {
// //   const requestObj = {};
// //   const presentProduct = database.find((dataP) => dataP._id === product.id);
// //   // PHYSICAL QUANTITY
// //   if (presentProduct.quantity) {
// //     if (product.physicalQuantity !== presentProduct.quantity) {
// //       requestObj.quantity = product.physicalQuantity;
// //     }
// //   }
// //   // EXP QTY
// //   if (presentProduct) {
// //     if (product.expQty === 0) {
// //       requestObj.expQty = product.expQty;
// //     }
// //   }
// //   // EXP DATE
// //   if (presentProduct) {
// //     if (product.expiryDate !== getFormTimeDate(presentProduct.expiryDate)) {
// //       requestObj.expiryDate = product.expiryDate;
// //     }
// //   }
// //   // check request Object
// //   return Object.keys(requestObj).length > 0
// //     ? { ...requestObj, id: presentProduct._id }
// //     : null;
// // });
// // };
// function getLastMonth() {
//   const now = new Date();
//   // Set month to previous month (JavaScript handles negative months by adjusting the year)
//   const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
//   const year = lastMonthDate.getFullYear();
//   // Months in JavaScript are zero-indexed, so add 1 and pad with leading zero if needed
//   const month = (lastMonthDate.getMonth() + 1).toString().padStart(2, "0");
//   return `${year}-${month}`;
// }
// const editProductProperty = async (
//   product,
//   token,
//   body,
//   unit,
//   location,
//   clinic
// ) => {
//   try {
//     const response = await editProductById(
//       token,
//       product.id,
//       JSON.stringify({ ...body })
//     );

//     if (request.ok) {
//       // ADD LOGS
//       const product = await response.json();
//       const movement = new Map();
//       movement.set("movement", "Stock Taking");
//       movement.set("issued", 0);
//       movement.set("balance", product.quantity);
//       movement.set("product", product._id);
//       movement.set("unit", unit);
//       movement.set("location", location);
//       movement.set("clinic", clinic);

//       const movementResponse = await addProductLogs(
//         token,
//         JSON.stringify(Object.fromEntries(movement))
//       );
//       if (movementResponse.ok) {
//         movement.clear();
//       } else {
//         throw new Object({
//           message: movementResponse.statusText,
//           status: movementResponse.status,
//         });
//       }
//     } else {
//       throw new Object({
//         message: response.statusText,
//         status: response.status,
//       });
//     }
//   } catch (error) {
//     if (error.status === 401) {
//       dispatch(clearAuthentication(error.status));
//     } else {
//       dispatch(sendProductMessenger("logs failed to save", true, error));
//     }
//   }
// };
// const addExpiryFunction = async (product, token, expQty) => {
//   try {
//     let expiryObject = null;
//     const newProductResponse = await getProductById(token, product.id);
//     if (newProductResponse.ok) {
//       const newProduct = await newProductResponse.json();
//       if (newProduct.unit.name.includes("STORE")) {
//         expiryObject = {
//           name: product.name,
//           quantity: +expQty,
//           expiryDate: getLastMonth(),
//           totalPrice: newProduct.costPrice * newProduct.quantity,
//           packSize: newProduct.packSize,
//           date: new Date(),
//         };
//       } else {
//         expiryObject = {
//           name: product.name,
//           quantity: +expQty,
//           expiryDate: getLastMonth(),
//           totalPrice: newProduct.unitCostPrice * newProduct.quantity,
//           packSize: newProduct.packSize,
//           date: new Date(),
//         };
//       }
//     } else {
//       throw new Object({
//         message: response.statusText,
//         status: response.status,
//       });
//     }

//     try {
//       const addExpiryResponse = await addExpiriesRequest(
//         token,
//         product.id,
//         JSON.stringify(expiryObject)
//       );
//       if (!addExpiryResponse?.ok) {
//         throw new Object({
//           message: addExpiryResponse.statusText,
//           status: addExpiryResponse.status,
//         });
//       }
//     } catch (error) {
//       if (error.status === 401) {
//         dispatch(clearAuthentication(error.status));
//       } else {
//         dispatch(sendProductMessenger("unable to add expiries", true, error));
//       }
//     }
//   } catch (error) {
//     if (error.status === 401) {
//       dispatch(clearAuthentication(error.status));
//     } else {
//       dispatch(sendProductMessenger("unable to add expiries", true, error));
//     }
//   }
// };
// const updateProductById = async (products, token, unit, clinic, location) => {
//   const updatedAllProducts = products.map(async (product) => {
//     const { expQty, ...body } = product;
//     if (body) {
//       editProductProperty(product, token, body, unit, location, clinic);
//     }
//     if (expQty) {
//       // send Data for expiries
//       addExpiryFunction(product, token, expQty);
//     }
//   });

//   await Promise.all(updatedAllProducts);
// };

// export const validateStockSubmission = (
//   productState,
//   productDatabase,
//   token,
//   unit,
//   clinic,
//   location
// ) => {
//   const productStock = compareStockQuantities(
//     productState,
//     productDatabase,
//     token
//   );
//   return async (dispatch) => {
//     if (!productStock) {
//       dispatch(sendProductMessenger("No changes were made", true));
//       setTimeout(() => {
//         dispatch(resetProductMessenger());
//       }, 3000);
//     } else {
//       // send request for it
//       updateProductById(productStock, token, unit, clinic, location);
//     }
//   };
// };

// AI

// Compare the stock quantities between products and the database.
const compareStockQuantities = (products, database) => {
  return products
    .map((product) => {
      const presentProduct = database.find((dataP) => dataP._id === product.id);
      if (!presentProduct) return null; // Skip if product not found

      const requestObj = {};

      // PHYSICAL QUANTITY: update if both values are valid and they differ.
      if (
        product.physicalQuantity &&
        product.physicalQuantity != null &&
        presentProduct.quantity != null &&
        product.physicalQuantity !== presentProduct.quantity
      ) {
        requestObj.quantity = product.physicalQuantity;
      }

      // EXP QTY: update if the expQty is valid (defined) and not equal to zero.
      if (typeof product.expQty !== "undefined" && product.expQty !== 0) {
        requestObj.expQty = product.expQty;
      }

      // EXP DATE: update if expiryDate is valid and doesn't match the formatted expiry date from the database.
      if (
        product.expiryDate &&
        product.expiryDate !== getFormTimeDate(presentProduct.expiryDate)
      ) {
        requestObj.expiryDate = product.expiryDate;
      }

      return Object.keys(requestObj).length > 0
        ? { ...requestObj, id: presentProduct._id }
        : null;
    })
    .filter((item) => item !== null);
};

// Expected Output:
// [ { id: '1', quantity: 10, expQty: 5 } ]

// Returns a string representing last month in "YYYY-MM" format.
function getLastMonth() {
  const now = new Date();
  // Adjust to the previous month (handles year wrap automatically)
  const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const year = lastMonthDate.getFullYear();
  const month = (lastMonthDate.getMonth() + 1).toString().padStart(2, "0");
  return `${year}-${month}`;
}

// Updates product properties and logs the change.
const editProductProperty = (product, token, body, unit, location, clinic) => {
  return async (dispatch) => {
    try {
      const response = await editProductById(
        token,
        product.id,
        JSON.stringify(body)
      );
      if (response.ok) {
        const updatedProduct = await response.json();
        const movement = new Map();
        movement.set("movement", "Stock Taking");
        movement.set("issued", 0);
        movement.set("balance", updatedProduct.quantity);
        movement.set("product", updatedProduct._id);
        movement.set("unit", unit);
        movement.set("location", location);
        movement.set("clinic", clinic);

        const movementResponse = await addProductLogs(
          token,
          JSON.stringify(Object.fromEntries(movement))
        );
        if (!movementResponse.ok) {
          throw {
            message: movementResponse.statusText,
            status: movementResponse.status,
          };
        }
      } else {
        throw { message: response.statusText, status: response.status };
      }
    } catch (error) {
      if (error.status === 401) {
        dispatch(clearAuthentication(error.status));
      } else {
        dispatch(sendProductMessenger("Logs failed to save", true, error));
      }
    }
  };
};

// Adds an expiry entry for the product.
const addExpiryFunction = (product, token, expQty) => {
  return async (dispatch) => {
    try {
      const newProductResponse = await getProductById(token, product.id);
      if (newProductResponse.ok) {
        const newProduct = await newProductResponse.json();
        let expiryObject = null;
        const expiryDate = getLastMonth();
        if (newProduct.unit.name.includes("STORE")) {
          expiryObject = {
            name: product.name,
            quantity: +expQty,
            expiryDate,
            totalPrice: newProduct.costPrice * newProduct.quantity,
            packSize: newProduct.packSize,
            date: new Date(),
          };
        } else {
          expiryObject = {
            name: product.name,
            quantity: +expQty,
            expiryDate,
            totalPrice: newProduct.unitCostPrice * newProduct.quantity,
            packSize: newProduct.packSize,
            date: new Date(),
          };
        }
        const addExpiryResponse = await addExpiriesRequest(
          token,
          product.id,
          JSON.stringify(expiryObject)
        );
        if (!addExpiryResponse?.ok) {
          throw {
            message: addExpiryResponse.statusText,
            status: addExpiryResponse.status,
          };
        }
      } else {
        throw {
          message: newProductResponse.statusText,
          status: newProductResponse.status,
        };
      }
    } catch (error) {
      if (error.status === 401) {
        dispatch(clearAuthentication(error.status));
      } else {
        dispatch(sendProductMessenger("Unable to add expiries", true, error));
      }
    }
  };
};

// Updates products based on the differences and adds expiry information if needed.
const updateProductById = async (products, token, unit, clinic, location) => {
  const updatePromises = products.map(async (product) => {
    // Destructure expQty and the rest of the body.
    const { expQty, ...body } = product;
    // Update product properties if there are changes.
    if (Object.keys(body).length > 0) {
      await editProductProperty(product, token, body, unit, location, clinic);
    }
    // If expQty is provided (truthy), add expiry.
    if (expQty) {
      await addExpiryFunction(product, token, expQty);
    }
  });
  await Promise.all(updatePromises);
};

// Main function to validate and process stock submissions.
export const validateStockSubmission = (
  productState,
  productDatabase,
  token,
  unit,
  clinic,
  location
) => {
  // Compare products with the database to get only those with changes.
  const productStock = compareStockQuantities(productState, productDatabase);
  return async (dispatch) => {
    if (!productStock.length) {
      dispatch(sendProductMessenger("No changes were made", true));
      setTimeout(() => {
        dispatch(resetProductMessenger());
      }, 3000);
    } else {
      await updateProductById(productStock, token, unit, clinic, location);
    }
  };
};
