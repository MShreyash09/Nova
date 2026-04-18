# 🎧 Nova - Premium Headphone E-commerce

Nova is a state-of-the-art e-commerce platform for high-end audio products, featuring a luxurious user interface, dynamic scroll sequences, and a robust full-stack architecture.

---

## ✨ Features

- **Interactive Scroll Sequence**: Smooth, cinema-quality headphone animations that respond to user scrolling.
- **Glassmorphic Design**: Modern, premium aesthetic using transparent layers and vibrant gradients.
- **Canvas Cursor Follower**: Sophisticated custom cursor animation for enhanced interactivity.
- **Full-stack Database**: Integrated **PostgreSQL** database managed via **Prisma ORM**.
- **RESTful API**: Express-based backend serving product and order data.
- **Responsive Layout**: Fully optimized for Desktop, Tablet, and Mobile.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18 (Vite)
- **Styling**: Tailwind CSS & Vanilla CSS
- **Animations**: GSAP & Framer Motion
- **UI Components**: shadcn/ui & Radix UI
- **State Management**: TanStack Query (React Query)

### Backend & Database
- **Runtime**: Node.js (Express)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Environment**: Docker (for local PG instance)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Docker (optional, for local database)

### Installation

1. **Clone the repository**:
   ```sh
   git clone https://github.com/GgauravJ05/WD_PBL.git
   cd WD_PBL
   ```

2. **Install dependencies**:
   ```sh
   npm install
   ```

3. **Set up the Environment**:
   Create a `.env` file (see `.env.example`) and add your database URL:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/headphone_db"
   ```

### Running Locally

1. **Start the Database** (if using Docker):
   ```sh
   docker-compose up -d
   ```

2. **Sync the Database**:
   ```sh
   npm run db:migrate
   ```

3. **Start the Backend Server**:
   ```sh
   npm run server
   ```

4. **Start the Frontend**:
   ```sh
   npm run dev
   ```

---

## 📂 Project Structure

- `/src`: React frontend logic and components.
- `/server`: Express backend and API routes.
- `/prisma`: Database schema and migrations.
- `/public`: Static assets including high-resolution images.

---

## 🔗 Resources

- **PPT Presentation**: [Canva Link](https://www.canva.com/design/DAHCZdL8-P0/FCyTfIhdrrNEGMGK7ZqIcg/edit?utm_content=DAHCZdL8-P0&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)
- **License**: MIT
