# Product Requirements Document: HealthStore Central POS

**Version:** 1.1
**Date:** May 20, 2025

**Table of Contents:**
1.  Introduction
2.  Goals
3.  Target Audience
4.  Core Requirements & Features
    * User Authentication & Authorization
    * Product Management
    * Inventory Management
    * Point of Sale (POS) Features
    * Customer Management
    * Supplier Management
    * AI-Powered Features
    * Reporting & Analytics
    * E-commerce Integration
5.  Technical Requirements
6.  Non-Functional Requirements
7.  Design and UI/UX Guidelines
8.  Future Considerations / Out of Scope
9.  Success Metrics

---

### 1. Introduction

HealthStore Central POS is a comprehensive Point of Sale system designed specifically for health stores. It aims to streamline daily operations, manage inventory effectively, enhance customer engagement, and provide valuable business insights through an intuitive and secure platform. The system integrates Next.js for the frontend, Firebase for backend services (implied by `package.json` and `README.md`), and Genkit with Google AI for intelligent features. This system will also serve as the backend for an online web-shop based on the Vercel Commerce v1 template.

---

### 2. Goals

* To provide an efficient and user-friendly POS interface for cashiers.
* To offer robust product and inventory management capabilities for administrators.
* To enhance customer relationship management through detailed customer profiles and purchase history.
* To leverage AI for intelligent product suggestions, customer insights, and promotional content generation.
* **To seamlessly integrate product and inventory data with a Vercel Commerce v1 based online storefront.**
* To ensure system security, data integrity, and scalability across both physical POS and online channels.
* To provide actionable analytics and reports for business decision-making, encompassing both POS and online sales.

---

### 3. Target Audience

* **Administrators:** Store owners or managers who require full system control, access to all data (including online sales and inventory), reports, and management features for both POS and the e-commerce platform.
* **Cashiers:** Store staff responsible for processing in-store sales, managing transactions, and interacting with customers at the point of sale. They will have restricted permissions.
* **Online Customers:** (Implicitly, via the e-commerce integration) Customers Browse and purchasing products through the online web-shop.

---

### 4. Core Requirements & Features

#### 4.1. User Authentication & Authorization

* **Multi-level User Access:**
    * **Admin Access:** Full system control, including user management, product and inventory management, financial reporting, and system settings. (Implemented via distinct "admin" mode in `ModeContext.tsx` and admin panel at `/admin/*`)
    * **Cashier Access:** Restricted permissions focused on POS operations, viewing product information, and processing sales. (Implemented via "cashier" mode in `ModeContext.tsx` and UI on `/`)
* **Secure Login System:** (To be implemented) Mechanism for users to log in securely.
* **Password Encryption:** (To be implemented) Passwords must be stored securely using strong encryption techniques.

#### 4.2. Product Management

* **Add, Edit, Delete Products:**
    * Functionality to add new products with details like SKU/ID, name, description, category, supplier, price, sale price, stock, optimum stock, and image URL. (Implemented in `src/app/admin/products/new/page.tsx`)
    * Functionality to edit existing product details. (Implemented in `src/app/admin/products/edit/[id]/page.tsx`/page.tsx])
    * Functionality to delete products (simulated in current code).
    * Product data (details, images, pricing, categories) to be the single source of truth for both POS and the online shop.
* **Product Categories:** Predefined categories: "Supplements", "Organic Foods", "Wellness Items", "Beverages", "Snacks". (As seen in `src/app/admin/products/new/page.tsx` and `src/types/index.ts`)
* **SKU/Barcode Integration:**
    * Products have a unique ID (SKU). (Evident in `Product` type and product forms/page.tsx])
    * Barcode scanner compatibility for quick product lookup at POS. (The `PriceViewer.tsx` component allows SKU input, which can be adapted for barcode scanning)
* **Price Management:**
    * Regular and sale price fields for products. (Evident in `Product` type and product forms/page.tsx])
* **Stock Threshold Alerts:** (To be implemented) System should provide alerts when product stock reaches predefined low levels.
    * `optimumStock` field exists, can be used for this.
    * Current UI shows "Low Stock" badges.
* **Product Images and Descriptions:**
    * Products can have an image URL and a detailed description. (Evident in `Product` type and product forms/views/page.tsx])
    * Image hosting via `placehold.co` is configured.
* **Bulk Import/Export Functionality:** (To be implemented) Allow administrators to import and export product data in bulk (e.g., CSV, Excel).

#### 4.3. Inventory Management

* **Real-time Stock Tracking:**
    * `stock` and `optimumStock` fields available for each product.
    * Stock levels are displayed on product cards and product view pages/page.tsx].
    * **Inventory levels must be synchronized in real-time (or near real-time) between the POS system and the Vercel Commerce online shop.**
* **Automated Stock Alerts for Low Inventory:** (To be implemented, linked with stock threshold alerts).
* **Purchase Order Generation:** (To be implemented) System to create and manage purchase orders for suppliers.
* **Supplier Management:**
    * Functionality to add new suppliers with contact details, address, and notes. (Implemented in `src/app/admin/suppliers/new/page.tsx`)
    * Functionality to list and manage suppliers (currently a placeholder).
    * Products can be associated with a supplier.
* **Stock Adjustment and Reconciliation Tools:** (To be implemented) Tools for manual stock adjustments (e.g., for damages, discrepancies) and reconciliation.
* **Inventory Reports and Analytics:** (To be implemented) Reports on stock levels, inventory movement, and valuation, reflecting both POS and online sales.

#### 4.4. Point of Sale (POS) Features

* **Intuitive Sales Interface:**
    * Cashier mode interface available on the main page (`src/app/page.tsx`).
    * Product selection via product cards.
    * Selected product details display.
    * `CurrentSalePanel.tsx` manages the ongoing transaction.
* **Barcode Scanner Compatibility:** Addressed via SKU input in `PriceViewer.tsx`, can be directly integrated for cart addition.
* **Multiple Payment Methods:** (To be implemented) Support for cash, card (credit/debit), and digital payments.
* **Receipt Generation and Customization:**
    * Receipt generation with transaction details, items, customer name (if available), and total amount. (Implemented in `ReceiptDialog.tsx`)
    * Print receipt functionality (simulated).
    * QR code generation for products (linking to product URL). (Implemented in `QrCodeDisplay.tsx`, `next.config.ts` allows `api.qrserver.com`)
* **Returns and Refunds Processing:** (To be implemented)
* **Discount and Promotion Management:**
    * Sale prices for products are supported.
    * AI-powered promotion suggestions for products. (Implemented in `src/app/admin/bi/page.tsx` using `suggest-promotional-product-flow.ts`)
    * AI-powered generation of promotional social media posts. (Implemented in `src/app/admin/products/view/[id]/page.tsx`/page.tsx] using `generate-product-promotion-flow.ts`)
* **Daily Sales Reports:** Partially implemented in Sales Intelligence dashboard (shows last 7 days).
* **Cash Drawer Management:** (To be implemented)
* **Shift Reports:** (To be implemented)

#### 4.5. Customer Management

* **Customer Database Integration:**
    * Functionality to add new customers with name, email, phone, address, customer since date, VIP status, and store credit. (Implemented in `src/app/admin/customers/new/page.tsx`)
    * Functionality to edit existing customer details. (Implemented in `src/app/admin/customers/edit/[id]/page.tsx`/page.tsx])
    * View customer details and purchase history. (Implemented in `src/app/admin/customers/view/[id]/page.tsx`/page.tsx])
    * Mock API and data structures for customers exist.
    * Customer data to be accessible for online shop accounts, potentially allowing for unified customer profiles.
* **Customer Purchase History:**
    * Track customer transactions (ID, timestamp, total amount). (Evident in `Customer` type and displayed in customer view/edit pages/page.tsx, datainvest23/jules-pos-g2/jules-pos-g2-340659228f3f9a0cac81c4af5c5d6b85ff3ed203/src/app/admin/customers/edit/[id]/page.tsx].)
    * Ability to view mock receipts for transactions/page.tsx].
    * Purchase history should ideally consolidate both POS and online shop orders.

#### 4.6. Supplier Management

* **Add, Edit, View Suppliers:**
    * Functionality to add new suppliers with name, contact person, email, phone, address, and notes. (Implemented in `src/app/admin/suppliers/new/page.tsx`)
    * Listing, editing, and viewing specific supplier details are planned but currently placeholders.
    * Mock API and data structures for suppliers exist.

#### 4.7. AI-Powered Features (Leveraging Genkit with Google AI)

* **AI Product Suggester:**
    * Suggests related products based on the currently viewed item (name, description, category). (Implemented in `ProductSuggester.tsx` using `suggest-related-products.ts` flow)
    * This feature should also be available for the online shop.
* **AI Customer Profile Generation:**
    * Generates an AI-powered customer profile including health pattern analysis and recommendations based on customer ID and purchase history. (Implemented in `src/app/admin/customers/view/[id]/page.tsx`/page.tsx] using `generate-customer-profile-flow.ts`)
* **AI Product Promotion Generation:**
    * Generates promotional social media post content for a product. (Implemented in `src/app/admin/products/view/[id]/page.tsx`/page.tsx] using `generate-product-promotion-flow.ts`)
* **AI Promotional Product Suggestion:**
    * Suggests a product to promote based on stock levels, price, category, etc. (Implemented in `src/app/admin/bi/page.tsx` using `suggest-promotional-product-flow.ts`)

#### 4.8. Reporting & Analytics

* **Sales Reports (Daily, Weekly, Monthly, Annual):**
    * Daily sales for the last 7 days are visualized in the Sales Intelligence dashboard. (Implemented in `src/app/admin/bi/page.tsx`)
    * Further reporting (weekly, monthly, annual) to be implemented, consolidating data from POS and online sales.
* **Inventory Valuation Reports:** (To be implemented)
* **Product Performance Metrics:**
    * Recent sales activity for a product is considered in AI promotion generation.
    * Simulated sales history per product is available in the product view/page.tsx].
    * More detailed metrics to be implemented, including online sales data.
* **Customer Purchase History:** Available under customer details/page.tsx, datainvest23/jules-pos-g2/jules-pos-g2-340659228f3f9a0cac81c4af5c5d6b85ff3ed203/src/app/admin/customers/edit/[id]/page.tsx].
* **Top Customers Report:** Implemented in the Sales Intelligence dashboard.
* **Employee Performance Tracking:** (To be implemented)
* **Export Capabilities:** (To be implemented) Reports should be exportable in multiple formats (e.g., CSV, PDF).

#### 4.9. E-commerce Integration

* **Frontend Web-Shop:**
    * Implement an online shop based on the Vercel Commerce v1 template (`https://github.com/vercel/commerce/tree/v1/site`).
    * The POS system will serve as the backend (product catalog, inventory, potentially customer and order management) for this online shop.
* **Real-time Sync with Web Store:**
    * Product Information: Product details (name, description, images, categories, pricing, sale pricing) managed in the POS admin panel must be reflected in real-time (or near real-time) on the Vercel Commerce storefront.
    * Inventory Synchronization: Stock levels must be synchronized across the POS and the online shop to prevent overselling and ensure accurate availability display. Updates from POS sales or admin adjustments should reflect online, and online sales should decrement POS inventory.
* **Order Management System:**
    * (To be implemented) A unified system or a tightly integrated one to manage orders originating from both the POS and the Vercel Commerce online shop.
    * Order statuses should be synchronized.
* **API Integration Capabilities:**
    * The POS system must expose robust APIs for product catalog, inventory levels, and potentially customer data and order processing to facilitate integration with the Vercel Commerce frontend.
    * The architecture should consider the API patterns and data structures typically expected by headless commerce frontends like Vercel Commerce.
* **Online/Offline Mode Capability for POS:** (To be implemented) The POS should ideally function in an offline mode and sync data once connectivity is restored. This is particularly important for inventory sync with the online store.

---

### 5. Technical Requirements

* **Frameworks & Libraries:**
    * POS Frontend & Admin: Next.js, React
    * Online Shop Frontend: Next.js (as per Vercel Commerce v1 template).
    * Styling: Tailwind CSS, Shadcn UI components (consistency across POS and online shop to be decided).
    * AI: Genkit, Google AI (Gemini 2.0 Flash)
    * Schema Validation: Zod
    * Charting: Recharts
* **Backend & Database:**
    * Firebase (implied from dependencies like `firebase` and `@tanstack-query-firebase/react`). Data fetching is currently mocked.
    * A robust backend API layer is critical for exposing data (products, inventory, orders) to the Vercel Commerce frontend.
* **Database Backup and Recovery System:** (To be implemented, typically a feature of the chosen BaaS like Firebase).
* **Cross-platform Compatibility:** Web-based application, accessible via modern browsers.
* **Security Updates:** Regular updates to dependencies and security patches. (Managed via `package.json` and platform updates)
* **Data Encryption:** (To be implemented for sensitive data at rest and in transit, standard HTTPS practices).
* **TypeScript:** Project uses TypeScript for type safety. (Evident from `.ts`, `.tsx` files and `tsconfig.json`)

---

### 6. Non-Functional Requirements

* **Usability:**
    * Intuitive and user-friendly interface for both admins and cashiers.
    * Clean, modern typography and clear, intuitive layout.
* **Performance:**
    * Fast load times and responsive interface for both POS and online shop.
    * Efficient data fetching and synchronization (currently simulated with delays).
* **Scalability:** The system should be able to handle a growing number of products, customers, transactions, and online traffic. (Choice of Next.js and Firebase supports scalability).
* **Security:**
    * Secure user authentication and authorization.
    * Protection against common web vulnerabilities (e.g., XSS, CSRF).
    * Data encryption for sensitive information.
* **Reliability:** High availability and minimal downtime for both POS and online shop.
* **Maintainability:** Well-structured and documented code for ease of maintenance and future development.
* **Technical Support System:** (To be implemented) A system for users to get help and report issues.

---

### 7. Design and UI/UX Guidelines

* **Color Palette:**
    * Primary Color: Earthy green (e.g., #8FBC8F from blueprint, or current theme's primary)
    * Background Color: Soft beige (e.g., #F5F5DC from blueprint, or current theme's background)
    * Accent Color: Muted gold (e.g., #BDB76B from blueprint, or current theme's accent)
    * (Current `globals.css` defines a theme with earthy greens and beiges).
    * Consistent branding and styling should be applied to the Vercel Commerce online shop.
* **Typography:** Clean, modern typography for easy readability. (Using Geist Sans and Geist Mono fonts)
* **Icons:** Simple, nature-inspired icons. (Lucide React icons are used throughout the application)
* **Layout:** Clear, intuitive layout for easy navigation and product discovery. Admin panel uses a sidebar layout. POS interface is designed for quick interaction.
* **Component Library:** Shadcn UI components are used for a consistent look and feel.

---

### 8. Future Considerations / Out of Scope (for initial version based on current code)

* **Full implementation and deployment of the Vercel Commerce v1 based online shop and its deep, real-time API integration with the POS backend.** This PRD defines the *requirements* for this integration.
* **Barcode Generation:** While QR codes for product URLs are implemented, actual barcode generation for SKUs is not.
* **Advanced Discount/Promotion Engine:** Complex rule-based discounts (e.g., BOGO, tiered discounts).
* **Loyalty Program Management.**
* **Detailed Employee Performance Tracking and Shift Management.**
* **Automated Purchase Order Generation and Stock Reconciliation.**
* **Direct Payment Gateway Integration for POS and Online Shop.**
* **POS Offline Mode Capability and robust sync mechanisms.**
* **Comprehensive Technical Support System.**
* **Advanced Reporting Modules:** (e.g., Inventory valuation, detailed product performance beyond basic sales).
* **User Role and Permission Management UI:** While roles are conceptual (admin/cashier), a UI to manage these is not present.
* **Password Encryption and Secure Login System:** Core security features that need full implementation.
* **Database Backup and Recovery (explicit setup):** While Firebase offers this, explicit configuration/strategy is TBD.
* **Bulk Import/Export for Products/Customers/Suppliers.**

---

### 9. Success Metrics

* **Transaction Speed:** Average time to complete a sale in cashier mode.
* **Admin Efficiency:** Time taken for common admin tasks (e.g., adding a product, updating customer info).
* **Online Sales Conversion Rate:** Percentage of online shop visitors who complete a purchase.
* **Inventory Accuracy:** Reduction in discrepancies between system stock (POS & Online) and physical stock.
* **Error Rate:** Frequency of errors during sales processing (POS & Online) or data management.
* **User Adoption & Satisfaction:** Feedback from cashiers, administrators, and online customers.
* **Uptime:** System availability for both POS and online shop.
* **Data Integrity:** Accuracy and consistency of product, customer, and sales data across platforms.
* **Usage of AI Features:** Frequency of use and perceived value of AI-generated suggestions and profiles.