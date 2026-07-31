# 📚 Personal Book Manager

> A simple, intuitive, and elegant space for readers to log their personal book collection, track reading habits, and manage their library.

## 🔗 Live Demo
👉 **[Personal Book Manager Live App](https://personal-book-manager-z6mf.vercel.app/login)**

---

## ✨ Features

- **🔒 Secure JWT Authentication**: User registration, login, and logout powered by JWT stored in secure `httpOnly` cookies.
- **📖 Complete Book Management (CRUD)**: Add, edit, update reading status, and delete books seamlessly[cite: 1].
- **🏷️ Status Tracking**: Organize books by designated reading stages:
  - 📖 **Want to Read**[cite: 1]
  - 📘 **Reading**[cite: 1]
  - ✅ **Completed**[cite: 1]
- **🔍 Filter & Search**: Instantly filter your library by reading status tabs or perform real-time searches across titles, authors, and custom tags[cite: 1].
- **📊 Real-time Insights**: View clean, high-level summary statistics of your collection right on the dashboard[cite: 1].
- **🎨 Modern & Responsive UI**: Designed with Tailwind CSS for a distraction-free user experience across desktop and mobile devices[cite: 1].

---

## 🛠️ Tech Stack

- **Frontend**: Next.js (App Router), React, Tailwind CSS[cite: 1]
- **Backend**: Next.js API Routes[cite: 1]
- **Database**: MongoDB Atlas with Mongoose ORM[cite: 1]
- **Authentication**: JSON Web Tokens (JWT) & `bcryptjs`[cite: 1]

---

## 🚀 Getting Started

Follow these steps to run the project locally on your machine.

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [Git](https://git-scm.com/)
- A [MongoDB Atlas](https://cloud.mongodb.com/) cluster connection string[cite: 1]

### 2. Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/kmassi69/personal-book-manager.git](https://github.com/kmassi69/personal-book-manager.git)
   cd personal-book-manager
