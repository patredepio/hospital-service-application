import React, { memo, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Message from "../../../../components/UI/Message/Message";
import UserComponent from "../../../../components/InstitutionComponent/UserComponent/UserComponent";

import { Navigate } from "react-router-dom";
const DeleteUser = memo((props) => {
  const dispatch = useDispatch();

  const isAuthenticated = useSelector((state) => state.login.isAuthenticated);
  const token = JSON.parse(sessionStorage.getItem("token"));

  const message = useSelector((state) => state.addProduct.message);
  const errorMessage = useSelector((state) => state.addProduct.errorMessage);

  return (
    <div>
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
      <UserComponent />
    </div>
  );
});

export default DeleteUser;
