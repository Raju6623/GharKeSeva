export async function handleRazorpayPayment({
    amount,
    packageName,
    userData,
    onSuccess,
    onFailure
}) {
    // Simulate payment process
    const confirmPayment = window.confirm(`Mock Payment of ₹${amount} for ${packageName}. Click OK to succeed, Cancel to fail.`);

    if (confirmPayment) {
        // Generate a mock payment ID
        const mockPaymentId = "pay_mock_" + Date.now();
        onSuccess(mockPaymentId);
    } else {
        onFailure();
    }
}
