import React, { Fragment } from "react";
import classes from "./ActionModal.module.css";
import Button from "../Button/Button";

const ActionModal = ({
  cancel,
  action,
  message = "",
  messageDescription = "",
  actionMessage = "",
}) => {
  return (
    <Fragment>
      <div
        onClick={cancel}
        className={classes.modal}
      ></div>
      <div className={classes.DeleteModal}>
        <p>{message}</p>
        <span>{messageDescription}</span>
        <div className={classes.buttonContainer}>
          <Button changed={cancel}>Cancel</Button>
          <Button
            config={{ className: message ? classes.send : null }}
            changed={action}
          >
            {actionMessage}
          </Button>
        </div>
      </div>
    </Fragment>
  );
};

export default ActionModal;
