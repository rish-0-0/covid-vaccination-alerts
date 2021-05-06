import * as React from "react";
import Form from "../components/form/Form";
import PaymentButton from "../components/payment/Payment";

function HomePage() {
  return (
    <section className="home">
      <Form />
      <div className="my-flexy-row flexy-center">
        <div className="my-flexy-12-col">
          <PaymentButton />
        </div>
      </div>
    </section>
  );
}

export default HomePage;
