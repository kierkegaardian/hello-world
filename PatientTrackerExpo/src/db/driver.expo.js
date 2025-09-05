import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('patienttracker.db');
export default db;

