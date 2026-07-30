# Complete Firebase Setup & Configuration Guide

This document provides complete instructions for setting up environment variables, enabling authentication providers, and configuring Firebase for **Project-Ground-Xero**.

---

## 1. Environment Variables Overview

Vite requires environment variables exposed to the client to be prefixed with `VITE_`.

| Variable Name | Description | Where to Find in Firebase Console |
| :--- | :--- | :--- |
| `VITE_FIREBASE_API_KEY` | Web API Key used for Identity Toolkit REST API | **Project Settings** > **General** > **Web API Key** |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Auth domain for OAuth redirects | **Project Settings** > **General** > **Your apps** > SDK Setup |
| `VITE_FIREBASE_DB_URL` | Realtime Database Endpoint URL | **Realtime Database** > **Data** tab header URL |
| `VITE_FIREBASE_PROJECT_ID` | Unique Firebase Project Identifier | **Project Settings** > **General** > **Project ID** |
| `VITE_FIREBASE_STORAGE_BUCKET` | Cloud Storage Bucket URL | **Project Settings** > **General** > **Storage bucket** |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Cloud Messaging Sender ID | **Project Settings** > **Cloud Messaging** > **Sender ID** |
| `VITE_FIREBASE_APP_ID` | Web App ID | **Project Settings** > **General** > **App ID** |

---

## 2. How to Obtain Credentials from Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/).
2. Select your project (e.g. `project-ground-xero`).
3. Click the gear icon ⚙️ in the top left menu and select **Project Settings**.
4. Scroll down to the **Your apps** section.
5. Select **Config** under SDK setup and copy the values into your local `.env.local` file.

---

## 3. How to Enable Authentication Providers

In Firebase Console, navigate to **Build** > **Authentication** > **Sign-in method**.

### A. Anonymous (Guest) Login
1. Click **Anonymous** under Sign-in providers.
2. Toggle **Enable** to **ON**.
3. Click **Save**.

### B. Email / Password Login
1. Click **Email/Password**.
2. Toggle **Enable** for Email/Password to **ON**.
3. Click **Save**.

### C. Google Sign-In
1. Click **Add new provider** > **Google**.
2. Toggle **Enable** to **ON**.
3. Select your support email under **Project support email**.
4. Click **Save**.

### D. GitHub Sign-In
1. Go to [GitHub Developer Settings](https://github.com/settings/developers) > **OAuth Apps** > **New OAuth App**.
2. Set Authorization Callback URL to: `https://<YOUR_PROJECT_ID>.firebaseapp.com/__/auth/handler`
3. Generate **Client ID** and **Client Secret**.
4. In Firebase Console > Authentication > Sign-in method > **GitHub**, paste the **Client ID** and **Client Secret**.
5. Click **Save**.

---

## 4. Automatic Account Linking Architecture

The application enforces **1 User = 1 Firebase Account (Single UID)**:
- **Email ↔ Google ↔ GitHub**: If a user attempts to sign in with Google or GitHub using an email already registered under another provider, the system prompts the user to authenticate with the existing provider and automatically links the new credential (`linkWithCredential`).
- **Guest Session Upgrades**: When an anonymous guest registers or signs in with Email, Google, or GitHub, `linkWithCredential` / `linkWithPopup` upgrades the guest account to permanent, preserving all existing user state under the exact same Firebase UID.
- **Account Settings Management**: Users can manage, link, and unlink sign-in providers directly in Account Settings (`ProfileView.tsx`).

---

## 5. Authorized Domains Setup

1. In Firebase Console > **Authentication** > **Settings** tab.
2. Under **Authorized domains**, verify that:
   - `localhost` is present.
   - `127.0.0.1` is added if testing on local IP.
   - Your production deployment domain (e.g. `your-app.vercel.app` or `your-domain.com`) is added.
