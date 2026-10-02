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

## Comprehensive Seller Features & Product Lifecycle

CraftGenius empowers handicrafters with a complete suite of tools to manage their shop and product lifecycle end-to-end:

### Product Management Lifecycle
- **Create & Edit:** Seamlessly add new products or edit existing listings with a rich interface.
- **Media Gallery:** Upload multiple high-quality images per product to showcase craftsmanship from every angle.
- **Inventory & Pricing:** Dynamically set product prices and manage stock availability in real-time.
- **Categorization:** Apply categories and custom tags to optimize marketplace discovery.
- **Product Availability:** Temporarily deactivate (`Pause`) or activate listings with a single click.
- **Quality Control:** Built-in product approval status to ensure marketplace standards.
- **Deletion:** Securely remove products from the catalog.

### Order Management
- Fully integrated order tracking, from `Pending` and `Processing` to `Shipped`, `Delivered`, `Refunded`, and `Disputed`.
- Automated earning splits and seamless payment reconciliation.

## Getting Started

In the project directory, you can run:

### `npm start`
Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.
