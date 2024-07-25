import { addUserRole, getUserRole } from "../../../../Utility/users/usersChat";
import { clearAuthentication } from "../auth/loginAction";
import {
  resetProductMessenger,
  sendProductMessenger,
} from "../inventory/addProductAction";

export const addUserRoleMethod = (e, state, setState, token) => {
  e.preventDefault();
  return async (dispatch) => {
    try {
      if (!state.departments.length) {
        dispatch(
          sendProductMessenger(
            "there needs to be at a department to add a role",
            true
          )
        );
        setTimeout(() => {
          dispatch(resetProductMessenger());
        }, 3000);
        return;
      }
      setState((prevState) => {
        return {
          ...prevState,
          loading: true,
        };
      });

      const form = Object.fromEntries(new FormData(e.target).entries());
      const department = state.departments.find(
        (dep) => dep.name === form.department
      );
      const newForm = {
        ...form,
        department: department._id,
      };
      const addUserRoleResponse = await addUserRole(
        token,
        JSON.stringify(newForm)
      );
      if (addUserRoleResponse?.ok) {
        dispatch(sendProductMessenger("user role added successfully"));
        setState((prevState) => {
          return {
            ...prevState,
            loading: false,
          };
        });
        e.target.reset();
      } else {
        throw {
          message: addUserRoleResponse.statusText,
          status: addUserRoleResponse.status,
        };
      }
    } catch (error) {
      if (error.status === 401) {
        dispatch(clearAuthentication(error.status));
      } else {
        dispatch(sendProductMessenger("unable to add user role", true));
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
export const getUserRoleMethod = (token, department, setState) => {
  return async (dispatch) => {
    setState((prevState) => {
      return {
        ...prevState,
        loading: true,
      };
    });
    try {
      const userRoleResponse = await getUserRole(token, department);
      if (userRoleResponse?.ok) {
        const userRoles = await userRoleResponse.json();
        setState((prevState) => {
          return {
            ...prevState,
            loading: false,
            userRoles,
          };
        });
      } else {
        throw {
          message: userRoleResponse.statusText,
          status: userRoleResponse.status,
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
          userRoles: [],
        };
      });
    }
  };
};
