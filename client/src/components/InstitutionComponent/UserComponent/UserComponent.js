import React from "react";
import classes from "./UserComponent.module.css";
import Input from "../../UI/Input/Input";
import Spinner from "../../UI/Spinner/Spinner";

const userComponent = React.memo((props) => {
  return (
    <div className={classes.userComponent}>
      <Input
        config={{
          type: "search",
          placeholder: "SEARCH USER USERNAME OR FIRST NAME OR LAST NAME",
          ref: props.userRef,
          value: props.search,
        }}
        changed={(e) => {
          props.setState((prevState) => {
            return {
              ...prevState,
              search: e.target.value,
            };
          });
        }}
      />
      <div className={[classes.headings, classes.userStructure].join(" ")}>
        <div>NAME</div>
        <div className={classes.desktopOnly}>USERNAME</div>
        <div>DEPARTMENT</div>
        <div>STATUS</div>
      </div>
      {/* Edit username,name,password,status,signError */}
      <div className={classes.userList}>
        {props.loading ? (
          <Spinner />
        ) : (
          props.users.map((user) => (
            <div
              className={[classes.userStructure, classes.userItem].join(" ")}
              onClick={() => props.clicked(props.setState, user)}
              key={user._id}
            >
              <div>
                {user.lastName} {user.firstName}
              </div>
              <div className={classes.desktopOnly}>{user.username}</div>
              <div>{user.department?.name}</div>
              <div>
                {!user.status || user.signError > 2
                  ? "DEACTIVATED"
                  : "ACTIVATED"}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
});

export default userComponent;
