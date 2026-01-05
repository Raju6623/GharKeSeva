import axios from 'axios';

export const handleRazorpayPayment = async ({ 
  amount, 
  packageName, 
  userData, 
  onSuccess, 
  onFailure 
}) => {
  const BACKEND_URL = "http://localhost:3001";

  // 1. Razorpay Script Load karne ka function
  const loadScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const isLoaded = await loadScript();
  if (!isLoaded) {
    alert("Razorpay SDK failed to load. Check your internet connection.");
    onFailure();
    return;
  }

  try {
    // 2. Backend se Order ID mangwana
    const { data: order } = await axios.post(`${BACKEND_URL}/api/auth/payments/create-order`, {
      amount: amount, 
    });

    // 3. Razorpay Options Setup
    const options = {
      key: "rzp_test_YOUR_KEY_HERE", // Apni Dashboard wali Key ID yahan dalein
      amount: order.amount,
      currency: order.currency,
      name: "Ghar Ke Seva",
      description: `Payment for ${packageName}`,
      order_id: order.id,
      handler: async function (response) {
        // Payment success hone par callback
        onSuccess(response.razorpay_payment_id);
      },
      prefill: {
        name: userData?.userFullName || "Customer",
        email: userData?.userEmail || "",
        contact: userData?.userPhone || "",
      },
      theme: { color: "#2563EB" },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();

  } catch (error) {
    console.error("Razorpay Error:", error);
    alert("Could not initialize payment.");
    onFailure();
  }
};