# Firebase Authentication Providers Setup Guide

This guide provides step-by-step instructions to enable and configure **Google**, **GitHub**, **Email/Password**, and **Anonymous (Guest)** authentication providers in your Firebase Console for **Project-Ground-Xero**.

---

## 1. Access Firebase Authentication Console

1. Navigate to [Firebase Console](https://console.firebase.google.com/).
2. Select your project: **`project-ground-xero`**.
3. In the left navigation menu, go to **Build** > **Authentication**.
4. Click on the **Sign-in method** tab.

---

## 2. Enable Anonymous (Guest) Authentication

1. Under **Sign-in providers**, click **Anonymous**.
2. Toggle **Enable** to **ON**.
3. Click **Save**.

---

## 3. Enable Google Sign-In

1. Under **Sign-in providers**, click **Add new provider**.
2. Select **Google**.
3. Toggle **Enable** to **ON**.
4. Set the **Project support email** (select your email address).
5. Click **Save**.

---

## 4. Enable GitHub Sign-In

1. Go to [GitHub Developer Settings - OAuth Apps](https://github.com/settings/developers).
2. Click **New OAuth App**.
3. Enter Application Name: `Project Ground-Xero`
4. Homepage URL: `https://project-ground-xero.firebaseapp.com`
5. Authorization Callback URL: `https://<YOUR_PROJECT_ID>.firebaseapp.com/__/auth/handler`
6. Click **Register application**.
7. Copy the **Client ID** and generate a **Client Secret**.
8. In Firebase Console > Authentication > Sign-in method > **GitHub**, enter the Client ID and Client Secret.
9. Click **Save**.

---

## 5. Active Providers Summary

| Provider | Type | Status |
| :--- | :--- | :--- |
| **Email / Password** | Password Auth | Built-in |
| **Anonymous (Guest)** | Guest Auth | Built-in |
| **Google** | OAuth 2.0 | Instant Enable with Support Email |
| **GitHub** | OAuth 2.0 | Requires GitHub OAuth App Credentials |
