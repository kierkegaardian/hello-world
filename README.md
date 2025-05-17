# Patient Tracker

A minimal cross-platform (iOS + Android) React-Native prototype for tracking patients by hospital and floor.  
All data are stored locally in SQLite; full audit triggers record every insert, update, and delete.

---

## Database Schema

`patient_tracking_schema.sql` defines:

- **Hospitals**
- **Floors**
- **Physicians**
- **Patients**
- **Attachments**
- **Audit Log** – triggers on the tables above

Load that file into a fresh SQLite DB (the app will auto-initialise it on first run).

---

## App Features

| Screen | What it does |
|--------|--------------|
| **Hospital List** | Filter hospitals by name, see patient counts, dive into their patient lists |
| **Add Hospital** | Create a hospital with notes and any number of floors |
| **Patient List** | View / filter patients for a hospital (unchecked-in patients show in grey) |
| **Add Patient** | Add a patient and assign hospital + floor |

---

## Prerequisites

- [Node.js](https://nodejs.org/) & npm  
- React Native CLI `npm i -g react-native-cli`  
- **macOS (iOS builds)** – Xcode + Command-line Tools  
- **Android** – Android Studio (any OS)

---

## Installation

```bash
git clone <repo-url>
cd PatientTracker
npm install
