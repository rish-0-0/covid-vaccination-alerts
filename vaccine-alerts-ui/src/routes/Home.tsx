import * as React from "react";
import Form from "../components/form/Form";
import PaymentModal from "../components/payment/Payment";

function HomePage() {
  return (
    <section className="home">
      <Form />
      <PaymentModal />
    </section>
  );
}

export default HomePage;
