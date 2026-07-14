# Clap Finder 📱👏

A lightweight, high-performance hybrid mobile application designed to locate a misplaced phone by listening for a clap and triggering a loud audio alert.

---

## 👤 Author

Developed and maintained by **Deepak Guptha Sitharaman (vzan2012)** 🚀

---

## 🎯 Project Goal

The primary goal of this project configuration is **Cloud-First Android Deployment**. By utilizing GitHub Actions, you do not need to install, configure, or run heavy local compilers like Android Studio. Every time you push a change to your repository, the cloud pipeline automatically compiles your web assets, bridges them to native Android via Capacitor, and outputs a downloadable, ready-to-install Android APK artifact!

## 🚀 Key Features

- **Zero-Local-Android-Setup:** Generate fully compiled `.apk` files directly from GitHub Actions without needing Android Studio installed locally.
- **Real-Time Audio Processing:** Utilizes the Web Audio API (`AnalyserNode` and `AudioContext`) to sample environmental noise frequencies and capture rapid decibel spikes.
- **Dynamic Volume Feedback:** Displays an on-screen, live numerical readout of ambient volume changes.
- **Optimized Mobile Audio Delivery:** Implements explicit web audio pre-warming to bypass strict modern mobile browser "user-gesture" audio playback restrictions.

---

## 🛠️ Project Structure

```text
CLAP-TO-FIND/
├── .github/workflows/
│   └── build.yml               # CI/CD automated pipeline for compiling APKs
├── android/                    # Native Android framework files (Modified for hardware access)
├── www/                        # Web app deployment directory (HTML/CSS/JS)
│   ├── js/
│   │   └── custom-scripts.js   # Clap detection, volume tracking, and audio alert logic
│   └── index.html              # Main application user interface
├── capacitor.config.json       # Structural bridge configurations for Web-to-Native
├── package.json                # Project dependencies and build scripts
└── README.md                   # Project documentation
```

---

## ☁️ Cloud Compilation & APK Extraction Workflow

This project is built to compile entirely in the cloud. You write your web code in HTML/JS, push it to GitHub, and let the automated runner generate your phone app.

### 1. Prerequisites (No Android Studio Required!)

To work on this project locally, you only need:

- **Node.js** (v16 or higher installed on your computer)
- **Git** (configured on your machine and linked to GitHub)

### 2. Making Web Changes & Syncing

When you modify your HTML, CSS, or `custom-scripts.js` file inside the `www/` directory, you must run Capacitor's sync script to update the native Android directory:

```bash
npx cap sync    # Copies web changes into the native Android structure
```

### 3. Pushing to GitHub to Build the APK

Simply save your changes, commit them, and push them to your repository:

```bash
git add .
git commit -m "feat: updated clap volume threshold calibration"
git push
```

### 4. Downloading Your APK

1. Go to your **GitHub Repository** in your web browser.
2. Click on the **Actions** tab at the top.
3. Click on the most recent running workflow run (usually named after your commit message).
4. Once the workflow turns green (successful), scroll down to the **Artifacts** section at the bottom of the run page.
5. Click on the generated **App Artifact** (usually a `.zip` containing your `app-release.apk` or `app-debug.apk`) to download it. Unzip and install it directly onto your Android device!

---

## 🔧 Under the Hood: Major Gotchas Solved

This repository contains critical config and code fixes to resolve common Web-to-Native issues:

### ⚡ Secure Web Context (`capacitor.config.json`)

Android WebViews quietly block microphone access over unverified `http://` localhost streams. We solved this by forcing Capacitor to use a secure local https scheme:

```json
"server": {
  "androidScheme": "https"
}
```

### 🔊 Audio Stream Priming (`custom-scripts.js`)

To prevent rogue ads from making noise, mobile browser engines block code-triggered audio. When you tap **"Activate Listener"**, the app silently plays a split-second blank buffer to unlock Android's media channel. This ensures that when a clap is detected, the alarm sound actually triggers and plays aloud.

### 📉 Microphones Calibration

Mobile device microphones inside web views rarely register volume spikes up to the standard web-browser standard of `140`. The detection script has been optimized to trigger at a realistic `60` threshold so you don't have to break your hands clapping to get a response!
