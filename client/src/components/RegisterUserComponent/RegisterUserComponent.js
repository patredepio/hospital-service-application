import React, { memo } from "react";
import { setForm } from "../../Utility/inventory/addProduct";
import PharmacyLogo from "../PharmacyLogo/PharmacyLogo";
import Input from "../UI/Input/Input";
import Button from "../UI/Button/Button";
const registerUserComponent = memo((props) => {
  return (
    <form
      className={props.classes.registerForm}
      onSubmit={(e) =>
        props.registerUserHandler(e, props.state, props.setState, props.token)
      }
    >
      <PharmacyLogo />
      <h3>SIGN UP</h3>

      <div id={props.classes.name}>
        <Input
          label='FIRST NAME'
          changed={(e) => setForm(e, props.setState)}
          config={{
            type: "text",
            name: "firstName",
            required: true,
            value: props.state.firstName,
            placeholder: "FIRST NAME",
            autoFocus: true,
          }}
        />
        <Input
          label='LAST NAME'
          changed={(e) => setForm(e, props.setState)}
          config={{
            type: "text",
            name: "lastName",
            required: true,
            value: props.state.lastName,
            placeholder: "LAST NAME",
          }}
        />
      </div>
      <Input
        title='DEPARTMENT'
        inputType='select'
        options={[...props.state.departments.map((dep) => dep.name)]}
        config={{
          required: true,
          name: "department",
          ref: props.departmentRef,
          value: props.state.department,
          required: true,
        }}
        changed={(e) => {
          const dep = props.state.departments.find(
            (dep) => dep.name === e.target.value
          );

          props.setState((prevState) => {
            return {
              ...prevState,
              departmentId: dep._id,
              [e.target.name]: dep.name,
              userRoles: [],
              userRole: "",
              userRoleId: "",
            };
          });
          props.getUserRoleMethodHandler(props.token, dep._id, props.setState);
        }}
      />
      <Input
        title='ROLE'
        inputType='select'
        options={[...props.state.userRoles.map((role) => role.name)]}
        config={{
          required: true,
          name: "userRole",
          ref: props.userRoleRef,
          value: props.state.userRole,
        }}
        changed={(e) => {
          const userRole = props.state.userRoles.find(
            (role) => role.name === e.target.value
          );
          props.setState((prevState) => {
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
        changed={(e) => setForm(e, props.setState)}
        config={{
          type: "text",
          name: "username",
          required: true,
          value: props.state.username,
          placeholder: "USERNAME",
        }}
      />

      <Input
        label='PASSWORD'
        changed={(e) => setForm(e, props.setState)}
        config={{
          type: "password",
          name: "password",
          required: true,
          value: props.state.password,
          placeholder: "PASSWORD",
        }}
      />
      <span className={props.classes.direction}>
        Password must contain at least 8 characters long, min 1 Uppercase 1
        Lowercase 1 Number 1 special character and only contains symbols from
        the alphabet, numbers and chosen special characters (@#$%^&+!=)
      </span>
      <Input
        label='RETYPE PASSWORD'
        changed={(e) => setForm(e, props.setState)}
        config={{
          type: "password",
          name: "retypePassword",
          required: true,
          value: props.state.retypePassword,
          placeholder: "RETYPE PASSWORD",
        }}
      />

      <Button
        config={{
          className: props.classes.registerBtn,
          type: "submit",
        }}
      >
        SIGN UP
      </Button>
    </form>
  );
});

export default registerUserComponent;
