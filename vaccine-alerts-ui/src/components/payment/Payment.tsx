import * as React from "react";
import { Button, Icon } from "@material-ui/core";
import { useGlobalStyles } from "../../constants";

function PaymentButton() {
  const classes = useGlobalStyles();
  return (
    <Button
      href="https://paytm.me/egyZ-0f"
      target="_blank"
      rel="noreferrer noopener"
      variant="contained"
      color="primary"
      className={classes.button}
      endIcon={<Icon>send</Icon>}
    >
      Donate to keep site running?
    </Button>
  );
}

export default PaymentButton;
