import * as React from "react";
import Form from "../components/form/Form";
import { Grid } from "@material-ui/core";
import PaymentButton from "../components/payment/Payment";
import { useGlobalStyles } from "../constants";

function HomePage() {
  const classes = useGlobalStyles();
  return (
    <section className="home">
      <Grid container className={classes.root}>
        <Form />
        <Grid item xs={12}>
          <Grid container>
            <Grid item xs={12}>
              <PaymentButton />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </section>
  );
}

export default HomePage;
