import React from "react";
import classes from "./StockTakingContainer.module.css";
import { getDate } from "../../Utility/general/general";
import Button from "../UI/Button/Button";

const StockTakingContainer = React.memo(
  ({ products, updateProduct, clearStock, submitStock }) => {
    const getExpiryAndAmount = (products) => {
      products.reduce(
        (acc, cur) => {
          if (cur.expQty > 0) {
            acc.cur += 1;
          } else {
            cur.unit.name.includes("STORE")
              ? (acc.amount += cur.quantity * cur.costPrice)
              : (acc.amount += cur.quantity * cur.unitCostPrice);
          }
        },
        { expiries: 0, amount: 0 }
      );
    };
    const { expiries, amount } = getExpiryAndAmount(products);
    return (
      <div className={classes.container}>
        <div className={classes.title}>
          <p className={classes.item}>STOCK TAKING SHEET</p>
          <p className={classes.item}>{getDate(new Date())}</p>
        </div>
        <div className={[classes.header, classes.structure].join(" ")}>
          <p className={classes.item}>PRODUCT NAME</p>
          <p className={classes.item}>QTY</p>
          <p className={classes.item}>P QTY</p>
          <p className={[classes.desktopOnly, classes.item].join(" ")}>
            COST PRICE
          </p>
          <p className={[classes.desktopOnly, classes.item].join(" ")}>
            EXP QTY
          </p>
          <p className={classes.item}>EXP DATE</p>
          <p className={classes.item}>AMOUNT</p>
        </div>
        <div className={classes.productContainer}>
          {Boolean(products.length > 1) &&
            products.map((product, i) => (
              <div
                className={[classes.structure, classes.productItem].join(" ")}
                key={product._id}
              >
                <p className={classes.item}>{product.name}</p>
                <p className={classes.item}>{product.quantity}</p>
                <input
                  value={product.physicalQuantity}
                  className={[classes.input].join(" ")}
                  type='number'
                  name='physicalQuantity'
                  onChange={(e) => updateProduct(e, i)}
                />
                <p className={[classes.desktopOnly, classes.item].join(" ")}>
                  {product.unit.name.includes("STORE")
                    ? product.costPrice
                    : product.unitCostPrice}
                </p>

                <input
                  value={product.expQty}
                  type='number'
                  name='expQty'
                  className={[classes.desktopOnly, classes.input].join(" ")}
                  onChange={(e) => updateProduct(e, i)}
                />
                <input
                  name='expiryDate'
                  type='month'
                  className={[classes.input, classes.monthInput].join(" ")}
                  value={product.expiryDate}
                  onChange={(e) => updateProduct(e, i)}
                />
                <p className={[classes.amount, classes.item].join(" ")}>
                  ₦{" "}
                  {!product.unit.name.includes("STORE")
                    ? `${Intl.NumberFormat("en-GB", {
                        compactDisplay: "long",
                      }).format(product.quantity * product.unitCostPrice)}`
                    : Intl.NumberFormat("en-GB", {
                        compactDisplay: "long",
                      }).format(product.quantity * product.costPrice)}
                </p>
              </div>
            ))}
        </div>
        <div className={classes.actionContainer}>
          <Button
            config={{
              className: classes.clearStock,
            }}
            changed={clearStock}
          >
            CLEAR STOCK
          </Button>
          <Button
            config={{
              className: classes.submitStock,
            }}
            changed={submitStock}
          >
            SUBMIT STOCK
          </Button>
        </div>
        <div className={classes.interaction}>
          <div className={classes.interactionItem}>
            <p className={classes.item}>Number of Products</p>
            <p className={classes.item}>{products.length}</p>
          </div>
          <div className={classes.interactionItem}>
            <p className={classes.item}>Number of Expired Products</p>
            <p className={classes.item}>{expiries}</p>
          </div>
          <div className={classes.interactionItem}>
            <p className={classes.item}>Grand Total</p>
            <p className={classes.item}>₦{amount}</p>
          </div>
        </div>
      </div>
    );
  }
);
export default StockTakingContainer;
