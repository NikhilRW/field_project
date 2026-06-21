// export const BASE_URI =
//   process.env.EXPO_PUBLIC_API_URL && !__DEV__
//     ? process.env.EXPO_PUBLIC_API_URL
//     : "http://localhost:5000";

export const BASE_URI = "https://sleeve-delivery-unloving.ngrok-free.dev";

export const DONATION_UPI_ID = "helpinghandsamajiksevasanstha@idbi";
export const DONATION_PAYEE_NAME = "Helping Hands";

export const buildDonationUpiUri = () =>
  `upi://pay?pa=${encodeURIComponent(DONATION_UPI_ID)}&pn=${encodeURIComponent(
    DONATION_PAYEE_NAME,
  )}&tn=${encodeURIComponent("Helping Hands Donation")}&cu=INR`;
