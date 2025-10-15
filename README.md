### 📘 **README.md**

```markdown
# 📰 NewsHive — Mobile News & Analytics Application

**NewsHive** is a cross-platform mobile application built with **React Native** and **Expo**, designed to let users explore, bookmark, and analyze global news articles.  
Beyond reading, the app transforms consumption into insight through an interactive **Analytics Dashboard** that visualizes trends, topics, and article distributions.

---

## 🧠 Project Overview

Most news apps overwhelm users with endless feeds. NewsHive addresses this by merging **intuitive browsing** with **data visualization**, enabling users to not just read news, but **understand patterns** in what they consume.

The app integrates:
- **NewsAPI** for real-time article fetching  
- **Favourites System** for personalized reading  
- **Analytics Dashboard** for category and topic insights  
- **Dark/Light Themes** for accessibility  
- **User Authentication Stack** for managing accounts  

---

## 🎯 Objectives

| Goal | Description |
|------|--------------|
| **Usability** | Provide clean UI and seamless navigation between Home, Favorites, Stats, and Account screens. |
| **Functionality** | Support article viewing, starring/un-starring, profile management, and theme toggling. |
| **Analytics** | Offer a StatsScreen with KPIs, charts, and trending topic summaries. |
| **Code Quality** | Implement modular components and global state management via React Contexts. |
| **Learning Outcome** | Demonstrate professional mobile development practices using React Native. |

---

## 🧩 Features

| Feature | Description |
|----------|-------------|
| 📰 **Home Screen** | Displays live articles fetched from NewsAPI. |
| ⭐ **Favorites Screen** | Allows users to save and view liked articles. |
| 📊 **StatsScreen (Analytics Dashboard)** | Shows article volume over time, source distribution, and category trends. |
| 🌗 **Dark/Light Theme** | User-controlled theming via ThemeContext. |
| 👤 **Account Management** | Supports login, registration, profile update, and feedback forms. |
| 🔒 **Security Awareness** | Demonstrates good practices (to be expanded with hashing and JWT in future work). |

---

## 🏗️ System Architecture

```

src/
├── components/       # Reusable UI and context components
├── services/         # API integration and data fetching logic
├── screens/          # Independent screens (Home, Favorites, Stats, Account)
├── contexts/         # ThemeContext & FavouriteContext
└── Root.js           # Handles authentication flow and navigation

````

- **Services** — `news.js` fetches live articles using `getTopHeadlines()` and `searchEverything()` from NewsAPI.  
- **Contexts** — Global state for favorites and theme control.  
- **Screens** — Each tab functions independently with modular logic and clean separation of concerns.  
- **Root.js** — Manages in-memory authentication and user flow.

---

## 🧮 Analytics Dashboard Details

The **StatsScreen** turns raw article data into visual insights using:
- **KPIs**: Total Articles, Unique Sources, and Languages  
- **Line Chart**: Article volume over time  
- **Bar Chart**: Top sources by article count  
- **Donut Chart**: Category distribution  
- **Trending Topics**: Extracted keywords from article titles  

Built using `useMemo` hooks for optimal performance and reactivity.

---

## 💻 Technologies Used

| Category | Tools |
|-----------|-------|
| Framework | React Native (Expo) |
| API | NewsAPI |
| State Management | React Contexts |
| Charts | React Native Chart Kit |
| Styling | Light/Dark themes with dynamic color palette |
| Testing | Manual iterative testing on Expo iOS/Android simulators |

---

## ⚙️ Installation & Running

1. Clone the repository:
   ```bash
   git clone https://github.com/BryanLoooo/Mobile-Development-NewsHive-News-mobile-application.git
   cd NewsHive
````

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the Expo server:

   ```bash
   npx expo start
   ```

4. Scan the QR code using **Expo Go** on your mobile device, or press:

   * `a` for Android Emulator
   * `i` for iOS Simulator
   * `w` for Web Preview

---

## 🧪 Testing & Debugging

* Verified login, registration, and error-handling flows.
* Simulated API disconnection to test offline handling.
* Tested dark/light theme toggling across components.
* Validated UI responsiveness and FlatList performance.

---

## 🧭 Future Enhancements

| Area            | Planned Improvement                                                                |
| --------------- | ---------------------------------------------------------------------------------- |
| **Persistence** | Integrate Firebase or MongoDB for permanent account and favorites storage.         |
| **Analytics**   | Add interactive charts with tooltips, filters, and NLP-powered sentiment analysis. |
| **Security**    | Implement hashed passwords and JWT-based authentication.                           |
| **Deployment**  | Publish as PWA and mobile builds with backend API proxy.                           |

---

## 🌟 Strengths

* Modular architecture aligned with professional engineering principles.
* Analytics dashboard that differentiates the app from standard readers.
* Accessibility via light/dark theming.
* Well-documented, maintainable, and scalable design.

---

## 🧩 Video Demo

📺 [Watch on YouTube](https://youtu.be/TGnkmvBHCR8)

---
