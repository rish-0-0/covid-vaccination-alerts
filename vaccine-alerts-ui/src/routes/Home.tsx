import * as React from "react";
import Form from "../components/form/Form";
import PaymentButton from "../components/payment/Payment";

function HomePage() {
  return (
    <section className="home">
      <Form />
      <PaymentButton />
    </section>
  );
}

export default HomePage;
