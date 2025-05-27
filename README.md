# 📱 Habit Tracker – Build Good Habits, Break Bad Ones!

A mobile application developed using **React Native CLI** and **TypeScript** to help users develop healthy routines and eliminate bad habits. The app allows users to register, create and manage habits, track daily/weekly progress, and visualize their streaks—all while storing data locally using **AsyncStorage**.

---

## 🎯 Project Overview

This Habit Tracker app enables users to:

- Register and login (local only)
- Create daily or weekly habits
- Mark habits as completed
- Track progress over time
- Persist user and habit data with AsyncStorage
- Visualize performance via simple stats or optional charts

---

## 🧩 Features

### Core Functionalities
- 🔐 **Local Registration/Login**
- ➕ **Add Habits** (Name + Frequency)
- 📋 **Habit List with Completion Toggle**
- 📈 **Progress Tracking** (Daily %, optional weekly)
- 🚪 **Logout** – Clears local storage and resets session

### Bonus Features (Optional Enhancements)

- 🌙 **Light / Dark Theme Mode**
- 🌐 **Offline-first Support**

---

## 📽️ Demo Video

🎬 [Click to Watch Demo] (https://drive.google.com/file/d/10sTEMeo76XGNU4GOfnkRIea1tqcgS7Xn/view?usp=sharing )



## 📦 APK Download

📲 [Download Android APK v1.0.0]([https://github.com/navonsanjuni/Habit_Tracker/releases/tag/v1.0.0]


## 🔗 GitHub Repository

🛠️ [https://github.com/navonsanjuni/Habit_Tracker.git]

---

## 📁 Folder Structure

HabitT/
├── src/
│ ├── components/
│ │ ├── common/ # Shared UI elements
│ │ ├── habits/ # Habit-specific UI components
│ │ └── calendar/ # Calendar view
│ ├── screens/
│ │ ├── auth/ # Login/Register
│ │ ├── habits/ # Habit-related screens
│ │ └── settings/ # Settings screen
│ ├── navigation/ # App navigation setup
│ ├── services/ # AsyncStorage & data logic
│ ├── context/ # App-wide state
│ ├── types/ # TypeScript types
│ ├── utils/ # Utilities
│ └── styles/ # Theme and style constants
├── App.tsx
├── package.json
└── README.md

---

---

## 🛠 Tech Stack

| Technology           | Description                            |
|----------------------|----------------------------------------|
| React Native CLI     | App development framework              |
| TypeScript           | Strong typing for components & logic   |
| React Navigation     | Stack + Tab navigation                 |
| AsyncStorage         | Local persistence for data             |
| useContext API       | Global state management (optional)     |

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/navonsanjuni/Habit_Tracker.git
cd HabitT

2. Install Dependencies
bash

npm install

3. Start the Metro Bundler
bash

npx react-native start
📱 Running the App
▶ Android

bash

npx react-native run-android
Ensure an emulator or a USB-connected device is available.

👨‍💻 Author
Name: Navon Sanjuni
Email:navonsanjuni178@gmail.com
