import * as React from "react";

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      resolve();
    };
    script.onerror = () => {
      reject(new Error(`Error loading script: ${src}`));
    };
    document.body.appendChild(script);
  });
}
/**
 * 
 * @param amount number in PAISA or smallest unit
 * @param currency CURRENCY CODE: INR or USD etc
 * @return boolean
 */
async function openRazorpayModal(amount: number, currency: "INR"): Promise<boolean> {
  try {
    await loadScript("https://checkout.razorpay.com/v1/checkout.js");
    return true;
  } catch (e) {
    console.error("Error ocurred while opening razorpay modal\n", e);
    return false;
  }
}

function PaymentModal() {
  return (
    <div className="payment-modal">
      <h1>Help!</h1>
    </div>
  );
}

export default PaymentModal;
