import React, { useCallback, useEffect, useState, useRef } from "react";
import Input from "../../components/UI/Input/Input";
import PharmacyLogo from "../../components/PharmacyLogo/PharmacyLogo";
import { Navigate } from "react-router-dom";
import Button from "../../components/UI/Button/Button";
import Message from "../../components/UI/Message/Message";
import Spinner from "../../components/UI/Spinner/Spinner";
import classes from "./Register.module.css";
import { setForm } from "../../Utility/inventory/addProduct";
import {
  getDepartmentsMethod,
  registerUser,
  getUserRoleMethod,
} from "../../store";
import { useDispatch, useSelector } from "react-redux";

const Register = () => {
  const dispatch = useDispatch();
  const departmentRef = useRef(null);
  const userRoleRef = useRef(null);
  const [state, setState] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    retypePassword: "",
    loading: false,
    departments: [],
    department: "",
    departmentId: "",
    userRoles: [],
    userRole: "",
    userRoleId: "",
  });
  const { departments, userRoles } = state;
  const isAuthenticated = useSelector((state) => state.login.isAuthenticated);
  const token = JSON.parse(sessionStorage.getItem("token"));
  const message = useSelector((state) => state.addProduct.message);
  const errorMessage = useSelector((state) => state.addProduct.errorMessage);
  const loading = useSelector((state) => state.register.loading);
  const registerUserHandler = useCallback(
    (e, state, setState, token) =>
      dispatch(registerUser(e, state, setState, token)),
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
          departmentId: department._id,
          department: department.name,
        };
      });

      getUserRoleMethodHandler(token, department._id, setState);
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
    <React.Fragment>
      {!isAuthenticated && !token && (
        <Navigate
          to='/institution/log-out'
          replace
        />
      )}
      <Message
        message={message}
        error={errorMessage}
      />
      {loading || state.loading ? (
        <Spinner />
      ) : (
        <form
          className={classes.registerForm}
          onSubmit={(e) => registerUserHandler(e, state, setState, token)}
        >
          <PharmacyLogo />
          <h3>SIGN UP</h3>

          <div id={classes.name}>
            <Input
              label='FIRST NAME'
              changed={(e) => setForm(e, setState)}
              config={{
                type: "text",
                name: "firstName",
                required: true,
                value: state.firstName,
                placeholder: "FIRST NAME",
                autoFocus: true,
              }}
            />
            <Input
              label='LAST NAME'
              changed={(e) => setForm(e, setState)}
              config={{
                type: "text",
                name: "lastName",
                required: true,
                value: state.lastName,
                placeholder: "LAST NAME",
              }}
            />
          </div>
          <Input
            title='DEPARTMENT'
            inputType='select'
            options={[...state.departments.map((dep) => dep.name)]}
            config={{
              required: true,
              name: "department",
              ref: departmentRef,
              value: state.department,
              required: true,
            }}
            changed={(e) => {
              const dep = state.departments.find(
                (dep) => dep.name === e.target.value
              );

              setState((prevState) => {
                return {
                  ...prevState,
                  departmentId: dep._id,
                  [e.target.name]: dep.name,
                  userRoles: [],
                  userRole: "",
                  userRoleId: "",
                };
              });
              getUserRoleMethodHandler(token, dep._id, setState);
            }}
          />
          <Input
            title='ROLE'
            inputType='select'
            options={[...state.userRoles.map((role) => role.name)]}
            config={{
              required: true,
              name: "userRole",
              ref: userRoleRef,
              value: state.userRole,
            }}
            changed={(e) => {
              const userRole = state.userRoles.find(
                (role) => role.name === e.target.value
              );
              setState((prevState) => {
                return {
                  ...prevState,
                  [e.target.name]: userRole.name,
                  userRoleId: userRole._id,
                };
              });
            }}
          />

          <Input
            label='USERNAME'
            changed={(e) => setForm(e, setState)}
            config={{
              type: "text",
              name: "username",
              required: true,
              value: state.username,
              placeholder: "USERNAME",
            }}
          />
          <span style={{ fontSize: "11.5px" }}>
            Password must contain at least 8 characters long, min 1 Uppercase 1
            Lowercase 1 Number 1 special character and only contains symbols
            from the alphabet, numbers and chosen special characters (@#$%^&+!=)
          </span>
          <Input
            label='PASSWORD'
            changed={(e) => setForm(e, setState)}
            config={{
              type: "password",
              name: "password",
              required: true,
              value: state.password,
              placeholder: "PASSWORD",
            }}
          />
          <Input
            label='RETYPE PASSWORD'
            changed={(e) => setForm(e, setState)}
            config={{
              type: "password",
              name: "retypePassword",
              required: true,
              value: state.retypePassword,
              placeholder: "RETYPE PASSWORD",
            }}
          />

          <Button
            config={{
              className: classes.registerBtn,
              type: "submit",
            }}
          >
            SIGN UP
          </Button>
        </form>
      )}
    </React.Fragment>
  );
};

export default Register;
