import { Fragment, useCallback, useEffect, useState } from "react";
import Input from "../../../components/UI/Input/Input";
import Button from "../../../components/UI/Button/Button";
import Spinner from "../../../components/UI/Spinner/Spinner";
import classes from "./UserRole.module.css";
import { useDispatch, useSelector } from "react-redux";
import { getDepartmentsMethod, addUserRoleMethod } from "../../../store";
import Message from "../../../components/UI/Message/Message";
import { Navigate } from "react-router-dom";
const UserRole = () => {
  const dispatch = useDispatch();
  const [state, setState] = useState({
    departments: [],
    loading: false,
  });
  const isAuthenticated = useSelector((state) => state.login.isAuthenticated);
  const token = JSON.parse(sessionStorage.getItem("token"));
  const errorMessage = useSelector((state) => state.addProduct.errorMessage);
  const message = useSelector((state) => state.addProduct.message);
  const getDepartmentsHandler = useCallback(
    (token, setState) => dispatch(getDepartmentsMethod(token, setState)),
    [dispatch]
  );
  const addRoleMethodHandler = useCallback(
    (e, state, setState, token) =>
      dispatch(addUserRoleMethod(e, state, setState, token)),
    [dispatch]
  );
  useEffect(() => {
    getDepartmentsHandler(token, setState);
  }, []);
  return (
    <div className={classes.container}>
      {!isAuthenticated && !token && (
        <Navigate
          to='/institution/log-out'
          replace={true}
        />
      )}
      <Message
        message={message}
        error={errorMessage}
      />
      {state.loading ? (
        <Spinner />
      ) : (
        <form
          className={classes.userRoleForm}
          onSubmit={(e) => addRoleMethodHandler(e, state, setState, token)}
        >
          <h3>ADD A USER ROLE</h3>
          <Input
            inputType='select'
            title='DEPARTMENT'
            config={{
              name: "department",
            }}
            options={[...state.departments].map((dep) => dep.name)}
          />
          <Input
            config={{
              placeholder: "NAME OF USER ROLE",
              name: "name",
            }}
          />
          <Button config={{ className: classes.confirm }}>ADD USER ROLE</Button>
        </form>
      )}
    </div>
  );
};

export default UserRole;
