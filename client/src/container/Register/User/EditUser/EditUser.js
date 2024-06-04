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
import { getUsersInstitutionRequest } from "../../../../store";
import { Navigate } from "react-router-dom";
import { editUserMethodHandler } from "../../../../Utility/institution/initInstitution";
import Button from "../../../../components/UI/Button/Button";
import classes from "./EditUser.module.css";
const EditUser = memo((props) => {
  const dispatch = useDispatch();
  const [state, setState] = useState({
    users: [],
    loading: false,
    search: "",
    selectedUser: null,
    edit: false,
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
  const { search } = state;
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
          <div>NEW CHANGE</div>
        </Fragment>
      ) : (
        <UserComponent
          users={state.users}
          userRef={userRef}
          search={state.search}
          setState={setState}
          loading={state.loading}
          clicked={editUserMethodHandler}
        />
      )}
    </div>
  );
});

export default EditUser;
