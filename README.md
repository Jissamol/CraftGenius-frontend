# CraftGenius Marketplace

CraftGenius is a sophisticated multi-vendor marketplace connecting customers with skilled handicrafters.

## Marketplace Payment Architecture

This project features a fully functional multi-vendor payment architecture powered by Stripe.

The order lifecycle ensures secure transactions and automated revenue splits:
1. **Customer Checkout:** The user securely pays for items from multiple sellers in a single transaction via Stripe Checkout.
2. **Order Generation:** Orders are securely verified via Stripe Webhooks.
3. **Platform Commission:** A configurable platform commission (e.g., 10%) is automatically deducted from the gross sale.
4. **Seller Earnings:** The net amount is securely credited to the respective seller's Earnings dashboard, ready for payouts.

**Flow:** `Customer` ➔ `Stripe Payment` ➔ `Order Generation` ➔ `Platform Commission Deduction` ➔ `Seller Earnings Allocation`

## Getting Started

In the project directory, you can run:

### `npm start`
Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.
