import React from "react";
import classes from "./PharmacySite.module.css";
const pharmacySite = React.memo((props) => (
  <div className={classes.Pharmacy_Site}>
    <div>SITE : {props.site}</div>
    <div className={classes.desktopOnly}>CLINIC : {props.clinic}</div>
    <div>UNIT : {props.unit}</div>
  </div>
));

export default pharmacySite;
