# 🍃 Elakka (ഏലയ്ക്ക)

**Elakka** is a premium, secure, and data-driven farm management application specifically designed for cardamom plantations. Built with a focus on field-first usability, it combines a stunning "Dark Forest" aesthetic with robust offline-first architecture.

![Elakka Splash](./branding/splash.png)

## ✨ Core Features

### 🔐 Secure Authentication
*   **6-Digit PIN Protection**: Mandatory authentication on startup using `expo-secure-store`.
*   **Secure Hashing**: PINs are never stored in plain text.
*   **Haptic Feedback**: Premium tactile response during authentication.

### 🚜 Field Management
*   **Plot Tracking**: Define and manage specific field sections with acreage and plant count.
*   **Treatment Logs**: Record fertilizer, pesticide, and fungicide applications with relational links to specific plots.
*   **Yield Monitoring**: Log daily harvest quantities and grade them (A, B, C) to track productivity trends.

### 📦 Inventory & Logistics
*   **Stock Tracking**: Real-time inventory for chemicals, tools, and fertilizers.
*   **Low Stock Alerts**: Automatic dashboard warnings when supplies run low.

### 🚩 Health & Monitoring
*   **Problem Reporting**: Flag diseases, pests, or nutrient deficiencies with severity levels (Low to Critical).
*   **Unified History**: A detailed timeline for every plot showing its entire spray, harvest, and issue history.
*   **Weather Logging**: Daily temperature and rainfall tracking to correlate environmental data with yield performance.

## 🎨 Design Philosophy: "The Dark Forest"
The UI is optimized for outdoor use, featuring high-contrast text against a deep, natural palette:
*   **Background**: `#0d1a0f` (Deep Forest)
*   **Surface**: `#132016` (Evergreen)
*   **Accent**: `#4ade80` (Lush Green)
*   **Text**: `#e8f5e9` (Mist White)

## 🛠️ Tech Stack
*   **Framework**: Expo SDK 54 (React Native 0.81)
*   **Language**: TypeScript
*   **Database**: SQLite (`expo-sqlite`)
*   **State Management**: Zustand
*   **Styling**: NativeWind (Tailwind CSS v4)
*   **Icons**: Lucide React Native & Material Icons

## 🚀 Getting Started

### Prerequisites
*   Node.js (LTS)
*   Expo Go app (on iOS/Android)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/donaljojoofficial/Elakka.git
   cd Elakka
   ```
2. Install dependencies:
   ```bash
   cd app
   npm install --force
   ```
3. Start the development server:
   ```bash
   npm start -- -c
   ```

## 📂 Project Structure
*   `app/`: The core Expo application code.
*   `docs/`: Comprehensive project documentation (PRD, Architecture, Security, etc.).
*   `branding/`: Visual assets and logos.

---
*Built with ❤️ for Cardamom Farmers.*
