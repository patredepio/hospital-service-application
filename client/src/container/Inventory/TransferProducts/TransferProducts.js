import React, { Fragment, useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import ErrorHandler from "../../../hoc/ErrorHandler/ErrorHandler";
import {
  initProductDatabase,
  clearProductDatabaseError,
  filteredProducts,
  validateTransfer,
  getLocationsByDepartment,
  getUnitsByDepartment,
  submitTransfer,
  clearMessage,
  sendMessage,
} from "../../../store";
import {
  addToProductListHandler,
  updateProductItem,
  deleteProductItem,
} from "../../../Utility/inventory/transferProducts";
import Message from "../../../components/UI/Message/Message";
import ProductContainer from "../../../components/ProductContainer/ProductContainer";
import TransferPreviewItem from "../../../components/TransferPreviewItem/TransferPreviewItem";
import Spinner from "../../../components/UI/Spinner/Spinner";
import { getClinics } from "../../../store/actions/action/generalLogin/generalLogin";
import ChatMessenger from "../../../components/UI/ChatMessenger/ChatMessenger";
import classes from "./TransferProducts.module.css";
import { notificationMessenger } from "../../../Utility/general";
const TransferProducts = (props) => {
  const dispatch = useDispatch();
  const [state, setState] = useState({
    searchModal: false,
    productList: [],
    transferModal: false,
    preview: false,
    loading: false,
    search: "",
    locations: [],
    units: [],
    clinics: [],
  });
  const message = useSelector((state) => state.addProduct.message);
  const errorMessage = useSelector((state) => state.addProduct.errorMessage);
  const isAuthenticated = useSelector((state) => state.login.isAuthenticated);

  const token = JSON.parse(sessionStorage.getItem("token"));
  const $location = JSON.parse(sessionStorage.getItem("location"))?.id;
  const unit = JSON.parse(sessionStorage.getItem("unit"))?.id;
  const clinic = JSON.parse(sessionStorage.getItem("clinic"))?.id;
  const department = JSON.parse(
    sessionStorage.getItem("department")
  )?.department;
  const products = useSelector((state) => state.editProduct.renderedProducts);
  const mainMessage = useSelector((state) => state.messenger.message);
  const productDatabase = useSelector(
    (state) => state.general.products.database
  );
  const productDatabaseError = useSelector(
    (state) => state.general.products.error
  );
  const productDatabaseLoader = useSelector(
    (state) => state.general.products.loading
  );

  const initProductDatabaseHandler = useCallback(
    (token, location, unit, clinic) =>
      dispatch(initProductDatabase(token, location, unit, clinic)),
    [dispatch]
  );
  const clearProductDatabaseErrorHandler = useCallback(
    () => dispatch(clearProductDatabaseError()),
    [dispatch]
  );
  const validateTransferHandler = useCallback(
    (state, setState) => dispatch(validateTransfer(state, setState)),
    [dispatch]
  );
  const filteredProductsHandler = useCallback(
    (event, products) => dispatch(filteredProducts(event, products)),
    [dispatch]
  );
  const getLocationsByDepartmentHandler = useCallback(
    (setState, department) =>
      dispatch(getLocationsByDepartment(setState, department)),
    [dispatch]
  );
  const getUnitsByDepartmentHandler = useCallback(
    (setState, department) =>
      dispatch(getUnitsByDepartment(setState, department)),
    [dispatch]
  );
  const getClinicsHandler = useCallback(
    (setState) => dispatch(getClinics(setState)),
    [dispatch]
  );
  const submitTransferHandler = useCallback(
    (e, state, setState, token, location, unit, clinic) =>
      dispatch(
        submitTransfer(e, state, setState, token, location, unit, clinic)
      ),
    [dispatch]
  );
  const mainMessageHandler = useCallback(
    (message) => dispatch(sendMessage(message)),
    [dispatch]
  );
  const clearMessageHandler = useCallback(
    () => dispatch(clearMessage()),
    [dispatch]
  );
  useEffect(() => {
    initProductDatabaseHandler(token, $location, unit, clinic);
    getLocationsByDepartmentHandler(setState, department);
    getUnitsByDepartmentHandler(setState, department);
    getClinicsHandler(setState);
  }, []);
  useEffect(() => {
    notificationMessenger(
      props.socket,
      mainMessageHandler,
      clearMessageHandler
    );
  }, [props.socket]);
  return (
    <Fragment>
      <ChatMessenger message={mainMessage} />
      <Message
        message={message}
        error={errorMessage}
      />
      {!isAuthenticated && !token && (
        <Navigate
          replace
          to='/pharma-app/log-out'
        />
      )}
      {productDatabaseError.message && (
        <ErrorHandler
          error={productDatabaseError.message}
          status={productDatabaseError.status}
          clearError={clearProductDatabaseErrorHandler}
        />
      )}
      <h4 className={classes.title}>TRANSFER PRODUCTS</h4>
      {productDatabaseLoader || state.loading ? (
        <Spinner />
      ) : state.preview ? (
        <TransferPreviewItem
          state={state}
          productList={state.productList}
          setState={setState}
          token={token}
          location={$location}
          unit={unit}
          clinic={clinic}
          submitTransfer={submitTransferHandler}
        />
      ) : (
        <ProductContainer
          filterMethod={filteredProductsHandler}
          products={productDatabase}
          filteredProducts={products}
          setState={setState}
          state={state}
          searchModal={state.searchModal}
          productList={state.productList}
          addToProductList={addToProductListHandler}
          updateProductItem={updateProductItem}
          deleteItem={deleteProductItem}
          validateTransfer={validateTransferHandler}
        />
      )}
    </Fragment>
  );
};

export default TransferProducts;
