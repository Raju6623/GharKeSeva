/**
 * Calculates the number of GS Coins earned based on the service price.
 * Standard calculation: 1 GS Coin for every ₹25 spent.
 * Example: ₹500 service = 20 Coins.
 * 
 * @param {number} price - The price of the service
 * @returns {number} - Number of coins to be earned
 */
export const calculateGSCoin = (price) => {
    if (!price || isNaN(price)) return 0;

    // Logic: 1 Coin per ₹25
    // You can adjust this ratio as per requirement (e.g. price / 50 for 2%)
    return Math.floor(price / 25);
};
