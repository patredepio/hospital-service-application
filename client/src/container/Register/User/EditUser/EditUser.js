import React, {
  Fragment,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import Message from "../../../../components/UI/Message/Message";
import UserComponent from "../../../../components/InstitutionComponent/UserComponent/UserComponent";
import { getUserRoleMethod, getDepartmentsMethod } from "../../../../store";
import { getUsersInstitutionRequest } from "../../../../store";
import { Navigate } from "react-router-dom";
import { editUser } from "../../../../Utility/institution/initInstitution";
import Button from "../../../../components/UI/Button/Button";
import classes from "./EditUser.module.css";
import RegisterUserComponent from "../../../../components/RegisterUserComponent/RegisterUserComponent";
import registerClasses from "../../Register.module.css";
const EditUser = memo((props) => {
  const dispatch = useDispatch();
  const departmentRef = useRef(null);
  const userRoleRef = useRef(null);
  const [state, setState] = useState({
    users: [],
    loading: false,
    search: "",
    selectedUser: null,
    edit: false,
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    retypePassword: "",
    departments: [],
    department: "",
    departmentId: "",
    userRoles: [],
    userRole: "",
    userRoleId: "",
  });
  const userRef = useRef();
  const isAuthenticated = useSelector((state) => state.login.isAuthenticated);
  const token = JSON.parse(sessionStorage.getItem("token"));

  const message = useSelector((state) => state.addProduct.message);
  const errorMessage = useSelector((state) => state.addProduct.errorMessage);
  const getUsersInstitutionHandler = useCallback(
    (token, state, setState) =>
      dispatch(getUsersInstitutionRequest(token, state, setState)),
    [dispatch]
  );
  const getDepartmentsHandler = useCallback(
    (token, setState) => dispatch(getDepartmentsMethod(token, setState)),
    [dispatch]
  );
  const getUserRoleMethodHandler = useCallback(
    (token, dep, setState) => dispatch(getUserRoleMethod(token, dep, setState)),
    [dispatch]
  );
  const { departments, userRoles, search } = state;
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search === userRef?.current?.value) {
        // send getUsers Request //
        getUsersInstitutionHandler(token, state, setState);
      } else {
        clearTimeout(timer);
      }
    }, 500);
  }, [search, userRef]);
  useEffect(() => {
    if (!departments.length) {
      getDepartmentsHandler(token, setState);
    } else {
      const department = state.departments.find(
        (dep) => dep.name === departmentRef.current?.value
      );
      setState((prevState) => {
        return {
          ...prevState,
          departmentId: department?._id,
          department: department?.name,
        };
      });

      getUserRoleMethodHandler(token, department?._id, setState);
    }
  }, [departments.length]);
  useEffect(() => {
    if (userRoles.length) {
      setState((prevState) => {
        const userRole = userRoles.find(
          (role) => role.name === userRoleRef.current?.value
        );
        return {
          ...prevState,
          userRoleId: userRole._id,
          userRole: userRole.name,
        };
      });
    }
  }, [departments.length, userRoles.length]);
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
      {state.edit ? (
        <Fragment>
          {state.selectedUser.signError > 2 && (
            <Button config={{ className: classes.confirm }}>
              {state.selectedUser.signError > 2 ? "CLEAR" : "NOT CLEAR"}
            </Button>
          )}
          <RegisterUserComponent
            state={state}
            setState
            classes={registerClasses}
            departmentRef={departmentRef}
            userRoleRef={userRoleRef}
            registerUserHandler={editUser}
            getUserRoleMethodHandler={getUserRoleMethodHandler}
            token={token}
          />
        </Fragment>
      ) : (
        <UserComponent
          users={state.users}
          userRef={userRef}
          search={state.search}
          setState={setState}
          loading={state.loading}
        />
      )}
    </div>
  );
});

export default EditUser;
