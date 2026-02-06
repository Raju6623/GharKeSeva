/**
 * Calculates the number of Coins earned based on the service price.
 * Standard calculation: 1 Coin for every ₹25 spent.
 * Example: ₹500 service = 20 Coins.
 * 
 * @param {number} price - The price of the service
 * @returns {number} - Number of coins to be earned
 */
export const calculateGSCoin = (price) => {
    if (price === undefined || price === null) return 0;

    // Normalize price: remove currency symbols, commas, etc.
    const numericPrice = typeof price === 'string'
        ? Number(price.replace(/[^0-9.-]+/g, ""))
        : Number(price);

    if (!numericPrice || isNaN(numericPrice)) return 0;

    // Logic: 1 Coin per ₹25
    // You can adjust this ratio as per requirement (e.g. price / 50 for 2%)
    return Math.floor(numericPrice / 25);
};
