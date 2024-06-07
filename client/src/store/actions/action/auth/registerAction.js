import {
  REGISTER_USER_PROCESS,
  INIT_USER_REGISTRATION,
  sendProductMessenger,
  resetProductMessenger,
} from "../../../index";
import { registerUserReq } from "../../../../Utility/auth";
const initRegistration = () => {
  return {
    type: INIT_USER_REGISTRATION,
  };
};
const registerUserProcess = () => {
  return {
    type: REGISTER_USER_PROCESS,
  };
};

export const registerUser = (e, form, setForm, token) => {
  e.preventDefault();
  const formData = Object.fromEntries(new FormData(e.target).entries());
  return async (dispatch) => {
    // "(?=[A-Za-z0-9@#$%^&+!=]+$)^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+!=])(?=.{8,}).*$";
    const pattern =
      /(?=[A-Za-z0-9@#$%^&+!=]+$)^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+!=])(?=.{8,}).*$/;
    if (!pattern.test(formData.password)) {
      sendProductMessenger("password doesn`t meet the requirement", true);
      setTimeout(() => {
        dispatch(resetProductMessenger());
      }, 2500);
      return;
    }
    if (formData.retypePassword === formData.password) {
      if (!form.departments.length || !form.userRoles.length) {
        if (!form.departments.length) {
          sendProductMessenger("a user needs to be under a department", true);
          setTimeout(() => {
            dispatch(resetProductMessenger());
          }, 2500);
          return;
        }
        if (!form.userRoles.length) {
          sendProductMessenger(
            "a user needs to be under role to be registered",
            true
          );
          setTimeout(() => {
            dispatch(resetProductMessenger());
          }, 2500);
          return;
        }
      }
      try {
        const newForm = {
          ...formData,
          role: form.userRoleId,
          department: form.departmentId,
        };
        dispatch(initRegistration());
        const response = await registerUserReq(token, JSON.stringify(newForm));
        if (response?.ok) {
          dispatch(registerUserProcess());
          dispatch(sendProductMessenger("Registration Successful"));
          e.target.reset();
          setForm((prevState) => {
            return {
              ...prevState,
              firstName: "",
              lastName: "",
              username: "",
              password: "",
              retypePassword: "",
            };
          });
        } else {
          throw new Object({
            message: "Unable to Register",
          });
        }
      } catch (error) {
        dispatch(registerUserProcess());
        dispatch(sendProductMessenger(error.message, true));
      }
    } else {
      dispatch(sendProductMessenger("Passwords dont match", true));
    }
    setTimeout(() => {
      dispatch(resetProductMessenger());
    }, 2500);
  };
};
