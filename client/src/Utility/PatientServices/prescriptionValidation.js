import { updateRequistionTabHandler } from "../inventory/requistion";

export const setPrescriptionFormat = (e, setFormat) => {
  setFormat((prevState) => {
    return {
      ...prevState,
      [e.target.name]: e.target.value,
    };
  });
};

export const validatePrescription = (prescription) => {
  if (!prescription.length) {
    return {
      valid: false,
      quantity: false,
    };
  } else {
    return prescription.reduce(
      (acc, requiste) => {
        if (+requiste.get("onHandQuantity") >= requiste.get("quantity")) {
          acc.quantity = true;
        } else {
          acc.quantity = false;
        }
        if (+requiste.get("quantity")) {
          acc.valid = true;
        } else {
          acc.valid = false;
        }
        return acc;
      },
      { valid: false, quantity: false }
    );
  }
};
export const deleteProductItem = (
  id,
  setPrescription,
  setNumber,
  setTotalPrice
) => {
  setPrescription((prevProducts) => {
    const newProducts = [...prevProducts];
    const filteredProducts = newProducts.filter(
      (product) => product.get("id") !== id
    );
    const information = updateRequistionTabHandler(filteredProducts);
    setTotalPrice(information.totalPrice);
    setNumber(information.length);
    return filteredProducts;
  });
};

export const filteredItems = (e, products, setRender, setFilteredProducts) => {
  if (e.target.value.trim() || e.target.value) {
    setRender(true);
    const filteredProducts = products.filter((product) =>
      product.name.includes(e.target.value.toUpperCase())
    );
    setFilteredProducts(filteredProducts);
  } else {
    setRender(false);
    setFilteredProducts([]);
  }
};
export const addPrescriptionItem = (
  id,
  setPrescription,
  products,
  setSearchRender,
  setTotalPrice,
  setNumberProducts,
  pricing,
  setSearch
) => {
  const product = products.find((product) => product._id === id);
  const newProduct = {
    ...product,
  };

  setPrescription((prevProducts) => {
    const duplicate = prevProducts.find(
      (pr) => pr.get("id") === newProduct._id
    );
    if (duplicate) {
      return prevProducts;
    } else {
      const parsedDate = Date.parse(`${newProduct.expiryDate}`);
      const newDate = new Intl.DateTimeFormat("en-GB", {
        year: "numeric",
        month: "2-digit",
      })
        .format(parsedDate)
        .replace("/", "-");
      const expiryDate = [newDate.split("-")[1], newDate.split("-")[0]].join(
        "-"
      );
      const prescriptionItem = new Map();
      prescriptionItem.set("name", newProduct.name);
      prescriptionItem.set("quantity", 1);
      prescriptionItem.set(
        "price",
        pricing === "NHIA"
          ? newProduct.nhiaPrice
          : pricing === "NNPC"
          ? newProduct.nnpcPrice
          : newProduct.sellingPrice
      );
      prescriptionItem.set(
        "quantityPrice",
        Number(
          (
            prescriptionItem.get("price") * +prescriptionItem.get("quantity")
          ).toFixed(2)
        )
      );
      prescriptionItem.set("onHandQuantity", newProduct.quantity);
      prescriptionItem.set("packSize", newProduct.packSize);
      prescriptionItem.set("expiryDate", expiryDate);
      if (pricing === "NHIA") {
        prescriptionItem.set("hmoPrice", newProduct.nhiaPrice * 9);
      }
      prescriptionItem.set("id", newProduct._id);
      const { length, totalPrice } = updateRequistionTabHandler([
        ...prevProducts,
        prescriptionItem,
      ]);
      setNumberProducts(length);
      setTotalPrice(totalPrice);
      return [prescriptionItem, ...prevProducts];
    }
  });
  setSearchRender(false);
  setSearch("");
};
export const updatePrescriptionPrice = (
  pricing,
  setPrescription,
  setNumber,
  setTotalPrice,
  products
) => {
  setPrescription((prevProducts) => {
    const newProducts = [...prevProducts];
    const updateProducts = newProducts.map((product) => {
      const selectedProduct = products.find(
        (pr) => pr._id === product.get("id")
      );
      product.set(
        "price",
        pricing === "NHIA"
          ? selectedProduct.nhiaPrice
          : pricing === "NNPC"
          ? selectedProduct.nnpcPrice
          : selectedProduct.sellingPrice
      );
      // For NHIA HMO PRICE
      if (pricing === "NHIA") {
        product.set("hmoPrice", selectedProduct.nhiaPrice * 9);
      } else {
        if (product.has("hmoPrice")) {
          product.delete("hmoPrice");
        }
      }
      product.set(
        "quantityPrice",
        (product.get("price") * +product.get("quantity")).toFixed(2)
      );
      return product;
    });
    const { length, totalPrice } = updateRequistionTabHandler(updateProducts);
    setNumber(length);
    setTotalPrice(totalPrice);
    return updateProducts;
  });
};
export const updatePrescriptionQuantity = (
  e,
  id,
  setPrescription,
  setTotalPrice,
  setNumber
) => {
  setPrescription((prevProducts) => {
    const newProducts = [...prevProducts];
    const selectedProduct = newProducts.find(
      (product) => product.get("id") === id
    );
    const index = newProducts.findIndex((product) => product.get("id") === id);

    selectedProduct.set("quantity", e.target.value);
    selectedProduct.set(
      "quantityPrice",
      Number((+e.target.value * selectedProduct.get("price")).toFixed(2))
    );
    newProducts.splice(index, 1, selectedProduct);
    const { length, totalPrice } = updateRequistionTabHandler(newProducts);
    setNumber(length);
    setTotalPrice(totalPrice);
    return newProducts;
  });
};

export const receipentSearchHandler = (e, setPreview, database) => {
  if (!e.target.value.trim() || !database.length) {
    setPreview((prevState) => {
      return {
        ...prevState,
        previewSearchRender: false,
      };
    });
    return;
  } else {
    const filteredItems = database.filter((data) =>
      data.name.includes(e.target.value.toUpperCase())
    );
    setPreview((prevState) => {
      return {
        ...prevState,
        previewSearchRender: true,
        filteredItems,
      };
    });
  }
};

export const setReceipentHandler = (receipentId, setPreview, database) => {
  const receipent = database.find((data) => data._id === receipentId);

  setPreview((prevState) => {
    return {
      ...prevState,
      patientSearch: "",
      previewSearchRender: false,
      changedReceipent: false,
      selectedReceipent: receipentId,
      receipent,
    };
  });
};

export const removeReceipentHandler = (setPreview) => {
  setPreview((prevState) => {
    return {
      ...prevState,
      selectedReceipent: "",
      receipent: null,
    };
  });
};

export const validateQuantity = (database, setPrescription) => {
  setPrescription((prevState) => {
    const products = [...prevState];
    products.forEach((product) => {
      const updatedProduct = database.find((p) => p._id === product.get("id"));
      if (updatedProduct.quantity !== product.get("onHandQuantity")) {
        product.set("onHandQuantity", updatedProduct.quantity);
      }
    });
    return products;
  });
};
