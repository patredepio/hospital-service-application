import React, { Fragment } from "react";
import Backdrop from "../../components/UI/Backdrop/Backdrop";
import classes from "./Modal.module.css";
const modal = (props) => {
  return (
    <Fragment>
      <Backdrop
        show={props.show}
        closed={props.modalClosed}
      />
      <div
        className={classes.Modal}
        style={{
          transform: props.show ? "translateY(-50px)" : "translateY(-100vh)",
          opacity: props.show ? "1" : "0",
        }}
      >
        {props.children}
      </div>
    </Fragment>
  );
};
export default React.memo(
  modal,
  (prevProps, nextProps) =>
    nextProps.show === prevProps.show &&
    nextProps.children === prevProps.children
);
