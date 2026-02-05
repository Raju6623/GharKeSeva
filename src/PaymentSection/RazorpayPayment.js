// Helper to load script dynamically
const loadScript = (src) => {
  return new Promise((resolve) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve(true);
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export async function handleRazorpayPayment({ orderData, userData, onSuccess, onFailure }) {
  try {
    // 1. Check Internet
    if (!navigator.onLine) {
      alert("You seem to be offline. Internet is required for payments.");
      onFailure();
      return;
    }

    // 2. Load SDK if missing
    const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
    if (!res) {
      alert('Razorpay SDK failed to load. Check your internet connection.');
      onFailure();
      return;
    }

    // 3. Configure Razorpay Options
    const options = {
      key: "rzp_test_RzRaOgQvrwPw9S", // Replace with VITE_RAZORPAY_KEY_ID if available
      amount: orderData.amount, // amount in paisa
      currency: "INR",
      name: "GharKeSeva",
      description: `Payment for Service`,
      order_id: orderData.id,
      handler: function (response) {
        onSuccess(response.razorpay_payment_id);
      },
      prefill: {
        name: userData?.userFullName || "Customer",
        email: userData?.userEmail || "",
        contact: userData?.userPhone || ""
      },
      theme: { color: "#6e42e5" },
    };

    const rzp = new window.Razorpay(options);

    rzp.on('payment.failed', function (response) {
      alert("Payment Failed: " + response.error.description);
      onFailure();
    });

    rzp.open();

  } catch (error) {
    console.error("Payment Init Error:", error);
    onFailure();
  }
}