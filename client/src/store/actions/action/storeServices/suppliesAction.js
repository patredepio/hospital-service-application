import { addProductLogs } from "../../../../Utility/inventory/addProduct";
import { updateProductQuantity } from "../../../../Utility/product";
import {
  getSuppliersRequest,
  getSupplyRequest,
  deleteSupplyRequest,
} from "../../../../Utility/storeServices/storeServices";
import { clearAuthentication } from "../auth/loginAction";
import {
  resetProductMessenger,
  sendProductMessenger,
} from "../inventory/addProductAction";

export const initSupplies = (token, setState, location, unit, clinic) => {
  return async (dispatch) => {
    try {
      setState((prevState) => {
        return {
          ...prevState,
          loading: true,
        };
      });
      const supplyResponse = await getSupplyRequest(token, {
        location,
        unit,
        clinic,
      });
      const supplierResponse = await getSuppliersRequest(token);
      if (supplierResponse?.ok) {
        const suppliers = await supplierResponse.json();
        setState((prevState) => {
          return {
            ...prevState,
            loading: false,
            suppliers,
          };
        });
      } else {
        throw {
          message: supplierResponse.statusText,
          status: supplierResponse.status,
        };
      }
      if (supplyResponse?.ok) {
        const supplies = await supplyResponse.json();
        setState((prevState) => {
          return {
            ...prevState,
            loading: false,
            supplies,
          };
        });
      } else {
        throw {
          message: supplyResponse.statusText,
          status: supplyResponse.status,
        };
      }
    } catch (error) {
      if (error.status === 401) {
        dispatch(clearAuthentication(error.status));
      }
      setState((prevState) => {
        return {
          ...prevState,
          loading: false,
          supplies: [],
        };
      });
    }
  };
};

export const filterSupplies = (
  e,
  token,
  setState,
  state,
  location,
  unit,
  clinic
) => {
  return async (dispatch) => {
    e.preventDefault();
    try {
      const formData = Object.fromEntries(new FormData(e.target).entries());
      setState((prevState) => {
        return {
          ...prevState,
          loading: true,
        };
      });
      if (formData.exchange === "ALL") {
        delete formData.exchange;
      } else if (formData.exchange === "SUPPLY") {
        formData.exchange = false;
      } else {
        formData.exchange = true;
      }
      const supplierId = state.suppliers.find(
        (supplier) => supplier.name === formData.supplier
      )._id;
      formData.supplier = supplierId;
      formData.unit = unit;
      formData.location = location;
      formData.clinic = clinic;
      const supplyResponse = await getSupplyRequest(token, formData);
      if (supplyResponse?.ok) {
        const supplies = await supplyResponse.json();
        await setState((prevState) => {
          return {
            ...prevState,
            loading: false,
            supplies,
            modal: false,
          };
        });
      } else {
        throw {
          message: supplyResponse.statusText,
          status: supplyResponse.status,
        };
      }
    } catch (error) {
      if (error.status === 401) {
        dispatch(clearAuthentication(error.status));
      }
      setState((prevState) => {
        return {
          ...prevState,
          loading: false,
          modal: false,
          supplies: [],
        };
      });
    }
  };
};

export const deleteSupply = (
  token,
  supplyId,
  setState,
  location,
  unit,
  clinic,
  products
) => {
  return async (dispatch) => {
    try {
      setState((prevState) => {
        return {
          ...prevState,
          loading: true,
        };
      });
      const deleteResponse = await deleteSupplyRequest(token, supplyId);
      if (deleteResponse?.ok) {
        products.forEach(async (pr) => {
          try {
            const updatedProductResponse = await updateProductQuantity(
              token,
              pr.id,
              JSON.stringify({ quantity: +pr.quantity })
            );
            if (updatedProductResponse?.ok) {
              const newProduct = await updatedProductResponse.json();
              const movement = Object.create(null);
              movement.movement = `Deleted Supply`;
              movement.issued = +pr.quantity;
              movement.balance = newProduct.quantity;
              movement.product = newProduct._id;
              movement.location = location;
              movement.unit = unit;
              movement.clinic = clinic;
              const productLogResponse = await addProductLogs(
                token,
                JSON.stringify(movement)
              );
              if (productLogResponse?.ok) {
                Object.keys(movement).forEach((key) => delete movement[key]);
                // Start from here
              } else {
                throw {
                  message: productLogResponse.statusText,
                  status: productLogResponse.status,
                };
              }
            } else {
              throw {
                message: updatedProductResponse.statusText,
                status: updatedProductResponse.status,
              };
            }
          } catch (error) {
            if (error.status === 401) {
              dispatch(clearAuthentication(error.status));
            } else {
              dispatch(sendProductMessenger("unable to delete Supply", true));
            }
          }
        });
        // it is not correct
        dispatch(sendProductMessenger("deleted Successfully  ✓"));
        setState((prevState) => {
          return {
            ...prevState,
            loading: false,
            preview: false,
            selectedSupply: null,
          };
        });
        dispatch(initSupplies(token, setState, location, unit, clinic));
      } else {
        throw {
          message: deleteResponse.statusText,
          status: deleteResponse.status,
        };
      }
    } catch (error) {
      if (error.status === 401) {
        dispatch(clearAuthentication(error.status));
      } else {
        dispatch(sendProductMessenger("unable to delete Supply", true));
      }
      setState((prevState) => {
        return {
          ...prevState,
          loading: false,
        };
      });
    }
    setTimeout(() => {
      dispatch(resetProductMessenger());
    }, 3000);
  };
};

export const getCompletedSupplies = (
  token,
  setState,

  location,
  unit,
  clinic,
  startDate,
  endDate
) => {
  return async (dispatch) => {
    try {
      setState((prevState) => {
        return {
          ...prevState,
          loading: true,
        };
      });

      const supplyResponse = await getSupplyRequest(token, {
        location,
        unit,
        clinic,
        startDate,
        endDate,
        exchange: false,
      });
      if (supplyResponse?.ok) {
        const supplies = await supplyResponse.json();
        await setState((prevState) => {
          return {
            ...prevState,
            loading: false,
            supplies,
            modal: false,
          };
        });
      } else {
        throw {
          message: supplyResponse.statusText,
          status: supplyResponse.status,
        };
      }
    } catch (error) {
      if (error.status === 401) {
        dispatch(clearAuthentication(error.status));
      }
      setState((prevState) => {
        return {
          ...prevState,
          loading: false,
          modal: false,
          supplies: [],
        };
      });
    }
  };
};
export const getCompletedExchanges = (
  token,
  setState,
  location,
  unit,
  clinic,
  startDate,
  endDate
) => {
  return async (dispatch) => {
    try {
      setState((prevState) => {
        return {
          ...prevState,
          loading: true,
        };
      });

      const supplyResponse = await getSupplyRequest(token, {
        location,
        unit,
        clinic,
        startDate,
        endDate,
        exchange: true,
      });
      if (supplyResponse?.ok) {
        const exchanges = await supplyResponse.json();
        await setState((prevState) => {
          return {
            ...prevState,
            loading: false,
            exchanges,
            modal: false,
          };
        });
      } else {
        throw {
          message: supplyResponse.statusText,
          status: supplyResponse.status,
        };
      }
    } catch (error) {
      if (error.status === 401) {
        dispatch(clearAuthentication(error.status));
      }
      setState((prevState) => {
        return {
          ...prevState,
          loading: false,
          modal: false,
          supplies: [],
        };
      });
    }
  };
};
