PatientTracker Expo Demo

Purpose
- Zero-cost iPhone demo via Expo Go. No Apple Developer account needed.
- Uses `expo-sqlite` in place of `react-native-sqlite-storage`.

Run locally (Simulator or device on your LAN)
1) Install dependencies
   cd PatientTrackerExpo
   npm install
   # For navigation packages, let Expo pick the right versions:
   npx expo install @react-navigation/native @react-navigation/native-stack react-native-screens react-native-safe-area-context @react-native-picker/picker expo-sqlite

2) Start the bundler
   npm run start
   # In Expo DevTools, choose Tunnel if your tester isn’t on the same Wi‑Fi

3) iOS Simulator (optional)
   - Press i in the terminal, or click “Run on iOS simulator” in Expo DevTools

4) On a real iPhone (Expo Go)
   - Install “Expo Go” from the App Store
   - In Expo DevTools, pick Tunnel and scan the QR with the iPhone camera
   - The app opens in Expo Go

What to test
- Hospitals: “Reset” in header to seed data; filter; Retire/Unretire; open a hospital
- Patients: list, filter, add/edit with floor, Retire/Unretire
- Patients Overview: cross-hospital list with filters & search; tap to edit
- Move patient: from Overview, edit and switch Hospital + Floor; save

Notes
- Data is stored locally on the device via SQLite; it persists between sessions
- You can reseed anytime using the “Reset” button on the Hospitals screen

