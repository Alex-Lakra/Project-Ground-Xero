# Ground_Xero OS

Ground_Xero OS is a futuristic, highly immersive, Matrix-themed reality selector application. It allows users to mount cognitive interfaces, simulate mainframe security overrides, and select between two completely distinct virtual constructs.

<div align="center">
  <img width="1200" height="475" alt="Morpheus Choice" src="src/assets/morpheus.svg" />
</div>

---

## 🕶️ Key Mainframe Constructs

### 1. Matrix Initialization Handshake (Bootloader)
An immersive initial zero-white-flash loader that renders immediately upon page load. Features:
- Katakana-based background **Digital Rain** cascade.
- Simulated mainframe startup sequence diagnostics typed out in real-time.
- ASCII-based loading progress bar.
- Skip control allowing instant page access.

### 2. Make Your Choice (The Construct)
The gateway interface displaying Morpheus holding the Red and Blue pills. Users can choose their reality path via interactive pulsing hand hotspots or brutalist buttons below the artwork.

### 3. Red Pill Terminal (The Mainframe)
A raw developer CLI terminal with built-in hacking simulations and an SSH mainframe state-machine connecting to the zero node.
- **Local Terminal Commands**:
  - `help` / `?` - List active terminal operations.
  - `clear` - Erase local console logs buffer cache.
  - `ssh username@zero` - Open an SSH tunnel into the zero mainframe node.
  - `exit` / `blue` - Terminate terminal session and return to Morpheus.
- **Zero Mainframe SSH Commands (Authenticated Session)**:
  - `help` / `?` - List authorized mainframe console operations.
  - `whoami` - Print the current active user username.
  - `passwd <new_password>` - Reset the password for your active user.
  - `logout` / `exit` - Terminate SSH session and return to local shell.
- **Mainframe Administrative Commands (Root Access)**:
  - `createuser <name> <default_password>` - Provision a new user account.
  - `listusers` - List all registered user accounts and their status in a clean ASCII table.
  - `deleteuser <name>` - Delete a standard user account.
  - `reset2fa <username>` - Reset 2FA status keys for a user.

### 4. Blue Pill Construct (Cozy Sector)
A soothing citizen portal designed to maintain comfort:
- **Vital Stabilizers**: Track cognitive comfort levels, stress indices, and stabilized heart rate metrics.
- **Calming Ambience Synthesizer**: Generates actual low-frequency audio oscillations (Rainy Cafe, Meadow Hum, White Static, Comfort Office).
- **Cozy Calendar**: Suggest and schedule cozy stress-free daily tasks.
- **Pleasant Dreams Storage**: Log pleasant memory recordings with stabilization rating stars.

---

## 🛠️ Setup & Local Deployment

### Prerequisites
- **Node.js** (v18.0.0 or higher recommended)
- **NPM**

### Quickstart Guide

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Node**:
   ```bash
   npm run dev
   ```

3. **Secure Mainframe Link**:
   Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## ⚙️ Settings Panel Configurations
Access the floating **Construct Settings Panel** (CPU Icon) to update active parameters:
- **Enforce System Monospace**: Overrides all system fonts to JetBrains Mono.
- **Scanline Intensity**: Adjusts the opacity overlay of the CRT screen simulator.
- **Sub-Code Drift Density**: Modifies background code rain stream density multipliers.
- **Diagnostic Transmission Speed**: Controls CLI text typing speeds.
- **Terminate Mind State**: Reset trigger to wipe the current active session.