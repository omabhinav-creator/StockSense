# StockSense
StockSense is a modular, real-time Inventory Management System (IMS) built to digitize warehouse operations, track multi-location stock movements, handle incoming/outgoing shipments, and maintain automated stock ledgers.
# 📦 StockSense — Modular Inventory Management System

![StockSense Banner](https://img.shields.io/badge/StockSense-v1.0.0-blue?style=for-the-badge&logo=appveyor)
![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-orange?style=for-the-badge)
![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen?style=for-the-badge)

> **StockSense** is a full-featured, modular Inventory Management System (IMS) designed to replace manual registers, error-prone spreadsheets, and fragmented tracking tools with a centralized, real-time digital workflow.

---

## 📑 Table of Contents

- [🌟 Overview](#-overview)
- [🎯 Target Users](#-target-users)
- [✨ Core Features](#-core-features)
- [📊 Dashboard & KPIs](#-dashboard--kpis)
- [🔄 Inventory Operations Flow](#-inventory-operations-flow)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Getting Started](#-getting-started)
- [🔐 Authentication & Security](#-authentication--security)
- [🗺️ UI Mockup](#️-ui-mockup)
- [📜 License](#-license)

---

## 🌟 Overview

Managing physical goods across warehouses, production floors, and distribution channels requires accurate, real-time visibility. **StockSense** streamlines stock movements from vendor arrival to final customer delivery, automatically updating ledgers and preventing stockouts with intelligent automation.

### Key Value Propositions
- ⚡ **Real-Time Ledger Updates:** Automatic stock increments and decrements on validation.
- 🏬 **Multi-Warehouse Support:** Track items across multiple physical locations, rooms, or racks.
- 🚨 **Automated Low-Stock Alerts:** Prevent out-of-stock scenarios with proactive notifications.
- 🔍 **Audit & Mismatch Resolution:** Perform quick physical-to-recorded stock reconciliations[cite: 1].

---

## 🎯 Target Users

| Role | Key Responsibilities | Primary Features Used |
| :--- | :--- | :--- |
| **📦 Inventory Managers** | Oversee incoming/outgoing inventory, reorder thresholds, and warehouse analytics[cite: 1]. | Dashboard KPIs, Reordering Rules, Product Catalog, Reports[cite: 1]. |
| **🏭 Warehouse Staff** | Process shipments, handle internal rack movements, picking, packing, and stock counts[cite: 1]. | Receipts, Delivery Orders, Internal Transfers, Adjustments[cite: 1]. |

---

## ✨ Core Features

### 1. 🏷️ Product Catalog & Stock Rules
- Create and manage products with SKU/Code, category, Unit of Measure (UoM), and initial quantities[cite: 1].
- Define custom reordering rules per location[cite: 1].
- Real-time stock availability breakdown per location[cite: 1].

### 2. 📥 Receipts (Incoming Goods)
- Receive stock directly from vendors or suppliers[cite: 1].
- Enter received quantities against purchase records[cite: 1].
- **Auto-Update:** Validating a receipt instantly increases warehouse stock count (e.g., Receive 50 units of *Steel Rods* ➔ Stock $+50$)[cite: 1].

### 3. 📤 Delivery Orders (Outgoing Goods)
- Fulfill customer shipments and outgoing sales orders[cite: 1].
- Integrated Picking & Packing workflow[cite: 1].
- **Auto-Update:** Validating a delivery order automatically deducts inventory (e.g., Deliver 10 *Chairs* ➔ Stock $-10$)[cite: 1].

### 4. 🔄 Internal Transfers
- Transfer goods between internal locations without affecting total global inventory[cite: 1].
- Examples: `Main Warehouse` ➔ `Production Floor` or `Rack A` ➔ `Rack B`[cite: 1].
- Every step is logged in the immutable **Stock Ledger**[cite: 1].

### 5. ⚖️ Stock Adjustments & Reconciliation
- Quickly correct discrepancies between physical counts and system records[cite: 1].
- Select product/location, enter verified quantity, and system logs the reconciliation difference automatically[cite: 1].

---

## 📊 Dashboard & KPIs

Upon logging in, users arrive at a high-level operational command center featuring[cite: 1]:

* 🟢 **Total Products in Stock:** Real-time count across all active items[cite: 1].
* 🔴 **Low Stock / Out of Stock Items:** Critical alerts requiring replenishment[cite: 1].
* 🟡 **Pending Receipts:** Incoming vendor deliveries waiting for check-in[cite: 1].
* 🔵 **Pending Deliveries:** Customer orders scheduled for picking/packing[cite: 1].
* 🟣 **Scheduled Internal Transfers:** Pending inter-warehouse or rack movements[cite: 1].

### 🔍 Dynamic Filters
Filter operational views effortlessly by[cite: 1]:
- **Document Type:** Receipts | Delivery Orders | Internal Transfers | Stock Adjustments[cite: 1]
- **Status:** `Draft` | `Waiting` | `Ready` | `Done` | `Canceled`[cite: 1]
- **Warehouse / Location**[cite: 1]
- **Product Category**[cite: 1]

---

## 🔄 Inventory Operations Flow

```text
[ Vendor Delivery ] ───► ( Receipt Validation ) ───► Stock +100 kg
                                 │
                                 ▼
                     ( Internal Transfer ) ───────► Main Store ➔ Production Rack
                                 │                  (Location updated, total unchanged)
                                 ▼
[ Customer Order  ] ───► ( Delivery Validation ) ──► Stock -20 kg
                                 │
                                 ▼
[ Physical Audit  ] ───► ( Stock Adjustment ) ────► 3 kg Damaged ➔ Stock -3 kg
                                 │
                                 ▼
                   🟢 ALL EVENTS LOGGED IN STOCK LEDGER
```[cite: 1]

---

## 🛠️ Tech Stack

- **Frontend:** React.js, Tailwind CSS, Vite, Lucide Icons
- **Backend:** Node.js, Express.js
- **Database:** MongoDB / PostgreSQL (Mongoose / Prisma)
- **Authentication:** JWT, OTP Service (Nodemailer / Twilio)[cite: 1]

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** `>= 18.x`
- **MongoDB** (Local instance or Atlas URI)
- **Git**

### Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/your-username/StockSense.git](https://github.com/your-username/StockSense.git)
   cd StockSense
