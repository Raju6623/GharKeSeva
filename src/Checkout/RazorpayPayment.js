import axios from 'axios';

export const handleRazorpayPayment = async ({ amount, packageName, userData, onSuccess, onFailure }) => {
  try {
    const BACKEND_URL = "http://localhost:3001";

    // 1. Backend se Order ID mangwana
    const { data: orderData } = await axios.post(`${BACKEND_URL}/api/auth/payments/create-order`, {
      amount: amount
    });

    // 2. Razorpay Options Configure karna
    const options = {
      key: "rzp_test_RzRaOgQvrwPw9S", 
      amount: orderData.amount,
      currency: "INR",
      name: "GharKeSeva",
      description: `Payment for ${packageName}`,
      order_id: orderData.id,
      handler: function (response) {
        onSuccess(response.razorpay_payment_id);
      },
      prefill: {
        // Aapke login data ke mutabiq keys change ki gayi hain
        name: userData?.userFullName || "Customer",
        email: userData?.userEmail || "",
        contact: userData?.userPhone || ""
      },
      theme: { color: "#2563EB" },
    };

    const rzp = new window.Razorpay(options);
    
    rzp.on('payment.failed', function (response) {
      alert("Payment Failed: " + response.error.description);
      onFailure();
    });

    rzp.open();

  } catch (error) {
    console.error("Payment Init Error:", error);
    alert("Razorpay connectivity issue. Check backend/internet.");
    onFailure();
  }
};