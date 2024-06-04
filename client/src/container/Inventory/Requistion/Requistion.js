import React, { useState, useCallback, useEffect } from "react";
import ErrorHandler from "../../../hoc/ErrorHandler/ErrorHandler";
import Spinner from "../../../components/UI/Spinner/Spinner";
import { Navigate } from "react-router-dom";
import PreviewComponent from "../../../components/UI/PreviewComponent/PreviewComponent";
import RequistionComponent from "../../../components/RequistionComponent/RequistionComponent";
import { filteredSearch } from "../../../Utility/inventory/requistion";
import { useDispatch, useSelector } from "react-redux";
import classes from "./Requistion.module.css";
import {
  initProductDatabase,
  clearProductDatabaseError,
  validateRequistion,
  clearRequistionModal,
  clearMessage,
  sendMessage,
  sendRequistion,
} from "../../../store";
import {
  addRequistionItemHandler,
  updateRequistionItemHandler,
  deleteRequistionItemHandler,
  addPotentialRequisteHandler,
} from "../../../Utility/inventory/requistion";
import Message from "../../../components/UI/Message/Message";
// import { storeNotificationMessenger } from "../../../Utility/general";
import ChatMessenger from "../../../components/UI/ChatMessenger/ChatMessenger";
const Requistion = (props) => {
  const dispatch = useDispatch();
  const token = JSON.parse(sessionStorage.getItem("token"));
  const $location = JSON.parse(sessionStorage.getItem("location"));
  const unit = JSON.parse(sessionStorage.getItem("unit"));
  const clinic = JSON.parse(sessionStorage.getItem("clinic"));
  const [search, setSearch] = useState("");
  const [searchRender, setSearchRender] = useState(false);
  const [filteredProducts, setfilteredProducts] = useState([]);
  const [requistion, setRequistion] = useState([]);
  const [numberOfProducts, setNumberOfProducts] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const productDatabase = useSelector(
    (state) => state.general.products.database
  );
  const productDatabaseError = useSelector(
    (state) => state.general.products.error
  );
  const produtDatabaseLoader = useSelector(
    (state) => state.general.products.loading
  );
  const requistionLoader = useSelector((state) => state.requistion.loading);
  const message = useSelector((state) => state.addProduct.message);
  const errorMessage = useSelector((state) => state.addProduct.errorMessage);
  const isAuthenticated = useSelector((state) => state.login.isAuthenticated);
  const requistionModal = useSelector((state) => state.requistion.modal);
  const mainMessage = useSelector((state) => state.messenger.message);
  const initProductDatabaseHandler = useCallback(
    (token, location, unit, clinic) =>
      dispatch(initProductDatabase(token, location, unit, clinic)),
    [dispatch]
  );
  const clearProductDatabaseErrorHandler = useCallback(
    () => dispatch(clearProductDatabaseError()),
    [dispatch]
  );
  const clearRequistionModalHandler = useCallback(
    () => dispatch(clearRequistionModal()),
    [dispatch]
  );
  const requistionValidationHandler = useCallback(
    (requistion) => dispatch(validateRequistion(requistion)),
    [dispatch]
  );

  const sendRequistionHandler = useCallback(
    (
      requistion,
      token,
      location,
      unit,
      numberOfProducts,
      totalPrice,
      setRequistion,
      setNumber,
      setPrice,
      clinic,
      socket
    ) =>
      dispatch(
        sendRequistion(
          requistion,
          token,
          location,
          unit,
          numberOfProducts,
          totalPrice,
          setRequistion,
          setNumber,
          setPrice,
          clinic,
          socket
        )
      ),
    [dispatch]
  );
  // const mainMessageHandler = useCallback(
  //   (message) => dispatch(sendMessage(message)),
  //   [dispatch]
  // );
  // const clearMessageHandler = useCallback(
  //   () => dispatch(clearMessage()),
  //   [dispatch]
  // );
  const length = productDatabase.length;
  useEffect(() => {
    initProductDatabaseHandler(token, $location?.id, unit?.id, clinic?.id);
  }, []);
  useEffect(() => {
    if (productDatabase.length) {
      addPotentialRequisteHandler(
        productDatabase,
        setRequistion,
        setSearchRender,
        setTotalPrice,
        setNumberOfProducts
      );
    }
  }, [length]);
  // useEffect(() => {
  //   storeNotificationMessenger(
  //     props.socket,
  //     mainMessageHandler,
  //     clearMessageHandler
  //   );
  // }, [props.socket]);
  return (
    <React.Fragment>
      <ChatMessenger message={mainMessage} />
      <Message
        message={message}
        error={errorMessage}
      />

      {productDatabaseError.message && (
        <ErrorHandler
          error={productDatabaseError.message}
          status={productDatabaseError.status}
          clearError={clearProductDatabaseErrorHandler}
        />
      )}
      {!isAuthenticated && !token && (
        <Navigate
          replace
          to='/pharma-app/log-out'
        />
      )}
      <h4 className={classes.title}>PRODUCT REQUISTION</h4>
      {produtDatabaseLoader ? (
        <Spinner />
      ) : requistionModal ? (
        <PreviewComponent
          requistion={requistion}
          unit={unit}
          location={$location}
          clinic={clinic}
          token={token}
          totalPrice={totalPrice}
          numberOfProducts={numberOfProducts}
          sendRequistion={sendRequistionHandler}
          removeModal={clearRequistionModalHandler}
          setSearch={setSearch}
          setRequistion={setRequistion}
          setNumber={setNumberOfProducts}
          setPrice={setTotalPrice}
          requistionLoader={requistionLoader}
          socket={props.socket}
        />
      ) : (
        <RequistionComponent
          search={search}
          setSearch={setSearch}
          searchRender={searchRender}
          setSearchRender={setSearchRender}
          filteredSearch={filteredSearch}
          filteredProducts={filteredProducts}
          setfilteredProducts={setfilteredProducts}
          products={productDatabase}
          addRequistionItem={addRequistionItemHandler}
          setRequistion={setRequistion}
          requistion={requistion}
          updateRequistionItem={updateRequistionItemHandler}
          deleteRequistionItem={deleteRequistionItemHandler}
          numberOfProducts={numberOfProducts}
          totalPrice={totalPrice}
          setNumberProducts={setNumberOfProducts}
          setTotalPrice={setTotalPrice}
          validateRequistion={requistionValidationHandler}
        />
      )}
    </React.Fragment>
  );
};

export default Requistion;
